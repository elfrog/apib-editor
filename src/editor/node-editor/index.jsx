import React from 'react';
import PropTypes from 'prop-types';

import VPanelSplitter from '../components/v-panel-splitter';
import NodePropertyView from './node-property-view';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/markdown';
import 'brace/theme/solarized_dark';
import 'brace/keybinding/vim';

export default class NodeEditor extends React.Component {
  static propTypes = {
    node: PropTypes.any.isRequired,
    onPropertyChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { header: props.node.hashHeader + ' ' + props.node.header }
  }

  componentWillReceiveProps(nextProps) {
    let node = nextProps.node;

    this.setState({ header: node.hashHeader + ' ' + node.header });
  }

  onHeaderChange = e => {
    let value = e.target.value;
    let header = value.substring(value.lastIndexOf('#') + 1, value.length).trim();

    if (this.props.onPropertyChange) {
      this.props.onPropertyChange(this.props.node, 'header', header);
    }

    this.setState({ header });
  }

  onDescriptionChange = (value) => {
    if (this.props.onPropertyChange) {
      this.props.onPropertyChange(this.props.node, 'description', value);
    }
  }

  onPropertyChange = (key, value) => {
    if (this.props.onPropertyChange) {
      this.props.onPropertyChange(this.props.node, key, value);
    }
  }

  render() {
    let node = this.props.node;
    let source = node.description;

    return <div className='apib-node-editor'>
      <VPanelSplitter defaultLeftPanelSize={300}>
        <NodePropertyView node={node} onPropertyChange={this.onPropertyChange} />

        <div className='apib-node-editor-content'>
          <div className='apib-node-editor-header'>
            <input type='text' value={this.state.header} onChange={this.onHeaderChange} />
          </div>
          <AceEditor
            name='apibAceEditor'
            ref='ace'
            mode='markdown'
            theme='solarized_dark'
            width='100%'
            height='100%'
            fontSize={14}
            tabSize={4}
            wrapEnabled={true}
            keyboardHandler='vim'
            editorProps={{$blockScrolling: Infinity}}
            value={source}
            onChange={this.onDescriptionChange}
          />
        </div>
      </VPanelSplitter>
    </div>;
  }
}
