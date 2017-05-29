import React from 'react';
import PropTypes from 'prop-types';

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
    node: PropTypes.any.isRequired,
    onPropertyChange: PropTypes.func
  };

  constructor(props) {
    super(props);
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
          <NodeHeader node={node} onChange={value => this.onPropertyChange('header', value)} />
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
