import React from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/markdown';
import 'brace/theme/solarized_dark';
import 'brace/keybinding/vim';

export default class NodeEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let node = this.props.node;
    let source = node ? node.description : '';

    return <div className='apib-node-editor'>
      <AceEditor
        name='apibAceEditor'
        ref='ace'
        mode='markdown'
        theme='solarized_dark'
        width='100%'
        height='100%'
        fontSize={14}
        keyboardHandler='vim'
        editorProps={{$blockScrolling: Infinity}}
        value={source}
      />
    </div>;
  }
}
