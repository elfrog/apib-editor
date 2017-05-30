import React from 'react';
import PropTypes from 'prop-types';

import EditorRepository from '../editor-repository';

import VPanelSplitter from '../components/v-panel-splitter';
import NodePropertyView from './node-property-view';
import NodeHeader from './node-header';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/markdown';
import 'brace/theme/solarized_dark';
import 'brace/keybinding/vim';

export default class NodeEditor extends React.Component {
  static propTypes = {
    rootNode: PropTypes.any.isRequired,
    activeNode: PropTypes.any.isRequired,
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

    return <div className='apib-node-editor'>
      <VPanelSplitter
        defaultLeftPanelSize={EditorRepository.getItemAsNumber('editor.ui.nodePropertyViewPanelSize')}
        onPanelSizeChange={size => EditorRepository.setItem('editor.ui.nodePropertyViewPanelSize', size)}
      >
        <NodePropertyView rootNode={this.props.rootNode} activeNode={node} onPropertyChange={this.onPropertyChange} />

        <div className='apib-node-editor-content'>
          <NodeHeader activeNode={node} onChange={value => this.onPropertyChange('header', value)} />
          <div className='apib-node-editor-description'>
            <AceEditor
              name='apibAceEditor'
              ref='ace'
              mode='markdown'
              theme='solarized_dark'
              width='100%'
              height='100%'
              style={{ fontFamily: 'Consolas, Monaco' }}
              fontSize={14}
              tabSize={4}
              useSoftTabs={true}
              wrapEnabled={true}
              keyboardHandler='vim'
              editorProps={{$blockScrolling: Infinity}}
              value={source}
              onChange={this.onDescriptionChange}
            />
          </div>
        </div>
      </VPanelSplitter>
    </div>;
  }
}
