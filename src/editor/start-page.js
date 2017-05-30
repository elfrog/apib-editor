import React from 'react';
import PropTypes from 'prop-types';

import { FaFolderOpenO, FaFileO } from 'react-icons/fa';

export default class StartPage extends React.Component {
  static propTypes = {
    onOpenFile: PropTypes.func.isRequired,
    onNewFile: PropTypes.func.isRequired
  };

  onFileOpen = e => {
    let file = e.target.files[0];

    if (file) {
      this.props.onOpenFile(file);
    }
  }
  
  render() {
    return <div className='apib-start-page'>
      <div className='apib-start-box'>
        <button className='apib-start-open-file' onClick={() => this.input.click()}>
          <FaFolderOpenO />
          <p>open your file</p>
        </button>
        <button className='apib-start-new-file' onClick={this.props.onNewFile}>
          <FaFileO />
          <p>or make new</p>
        </button>
      </div>

      <input type='file' onChange={this.onFileOpen} style={{ display: 'none' }} ref={input => this.input = input} />
    </div>;
  }
}
