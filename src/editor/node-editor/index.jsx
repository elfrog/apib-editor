import React from 'react';
import PropTypes from 'prop-types';

import StorageService from 'platform/storage-service';

import VPanelSplitter from '../components/v-panel-splitter';
import NodePropertyView from './node-property-view';
import NodeHeader from './node-header';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/markdown';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/keybinding/vim';

const ACE_THEMES = {
  'Solarized Dark': 'solarized_dark',
  'Solarized Light': 'solarized_light',
};

export default class NodeEditor extends React.Component {
  static propTypes = {
    rootNode: PropTypes.any.isRequired,
    activeNode: PropTypes.any.isRequired,
    settings: PropTypes.any.isRequired,
    onPropertyChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  onDescriptionChange = (value) => {
    if (this.props.onPropertyChange) {
      this.props.onPropertyChange(this.props.activeNode, 'description', value);
    }
  }

  onPropertyChange = (key, value) => {
    if (this.props.onPropertyChange) {
      this.props.onPropertyChange(this.props.activeNode, key, value);
    }
  }

  render() {
    let node = this.props.activeNode;
    let source = node.description;
    let settings = this.props.settings;

    return <div className='apib-node-editor'>
      <VPanelSplitter
        defaultLeftPanelSize={StorageService.get('editor.ui.nodePropertyViewPanelSize')}
        onPanelSizeChange={size => StorageService.set('editor.ui.nodePropertyViewPanelSize', size)}
      >
        <NodePropertyView rootNode={this.props.rootNode} activeNode={node} onPropertyChange={this.onPropertyChange} />

        <div className='apib-node-editor-content'>
          <NodeHeader activeNode={node} onChange={value => this.onPropertyChange('header', value)} />
          <div className='apib-node-editor-description'>
            <AceEditor
              name='apibAceEditor'
              ref='ace'
              mode='markdown'
              theme={ACE_THEMES[settings.theme]}
              width='100%'
              height='100%'
              style={{ fontFamily: settings.font }}
              fontSize={settings.fontSize}
              tabSize={4}
              useSoftTabs={true}
              wrapEnabled={true}
              keyboardHandler={settings.vimMode ? 'vim' : ''}
              editorProps={{$blockScrolling: true}}
              setOptions={{newLineMode: 'unix'}}
              value={source}
              onChange={this.onDescriptionChange}
              onLoad={editor => {
                // AceEditor can't calcaulte its size immediately in certain browsers.
                // So recalculating size with delay is needed.
                setTimeout(() => editor.resize(true), 100);
              }}
            />
          </div>
        </div>
      </VPanelSplitter>
    </div>;
  }
}
