import React from 'react';
import PropTypes from 'prop-types';

import Modal from './components/modal';
import Toast from './components/toast';

import { FaFolderOpenO, FaFileO } from 'react-icons/fa';

const API_BLUEPRINT_EXAMPLES = [
  {
    name: 'Named Resource and Actions',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/03.%20Named%20Resource%20and%20Actions.md'
  },
  {
    name: 'Grouping Resources',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/04.%20Grouping%20Resources.md'
  },
  {
    name: 'Responses',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/05.%20Responses.md'
  },
  {
    name: 'Requests',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/06.%20Requests.md'
  },
  {
    name: 'Parameters',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/07.%20Parameters.md'
  },
  {
    name: 'Attributes',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/08.%20Attributes.md'
  },
  {
    name: 'Advanced Attributes',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/09.%20Advanced%20Attributes.md'
  },
  {
    name: 'Data Structures',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/10.%20Data%20Structures.md'
  },
  {
    name: 'Advanced Action',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/12.%20Advanced%20Action.md'
  },
  {
    name: 'Named Endpoints',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/13.%20Named%20Endpoints.md'
  },
  {
    name: 'Real World API',
    url: 'https://raw.githubusercontent.com/apiaryio/api-blueprint/master/examples/Real%20World%20API.md'
  }
];

export default class StartPage extends React.Component {
  static propTypes = {
    action: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  componentDidMount() {
    this.props.action.on('editor:showStartPage', this.openModal);
  }

  componentWillUnmount() {
    this.props.action.off('editor:showStartPage', this.openModal);
  }

  openModal = () => {
    this.setState({ open: true });
  }

  closeModal = () => {
    this.setState({ open: false });
  }

  onOpenFile = async () => {
    await this.props.action.do.openFile();
    this.closeModal();
  }

  onNewFile = () => {
    this.props.action.do.openNewDocument();
    this.closeModal();
  }

  onExampleClick = async example => {
    await this.props.action.do.openRemoteFile(example.name + '.md', example.url);
    this.closeModal();
  }
  
  render() {
    return <Modal
      open={!this.props.action.state.rootNode || this.state.open}
      closable={this.state.open}
      onClose={this.closeModal}
    >
      <div className='apib-start-page'>
        <div className='apib-start-box'>
          <h1>APIB Editor for API Blueprint</h1>
          <button className='apib-start-open-file' onClick={this.onOpenFile}>
            <FaFolderOpenO />
            <p>open your file</p>
          </button>
          <button className='apib-start-new-file' onClick={this.onNewFile}>
            <FaFileO />
            <p>or make new</p>
          </button>
        </div>

        <div className='apib-start-example-box'>
          <h1>Examples</h1>
          <ul>
            {API_BLUEPRINT_EXAMPLES.map(example =>
              <li key={example.name}>
                <a onClick={() => this.onExampleClick(example)}>{example.name}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Modal>;
  }
}
