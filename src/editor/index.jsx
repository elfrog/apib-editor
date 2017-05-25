import React from 'react';

import VPanelSplitter from './v-panel-splitter';
import Panel from './panel';

import NodeList from './node-list';
import NodeEditor from './node-editor';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.action = props.action;
  }

  render() {
    return <div className='apib-editor'>
      <VPanelSplitter>
        <NodeList
          nodeList={this.props.nodeList}
          activeNode={this.props.activeNode}
          onFilter={this.action.do.filterNodeList}
          onSelect={this.action.do.selectNode}
        />
        <NodeEditor
          node={this.props.activeNode}
        />
      </VPanelSplitter>
    </div>;
  }
}
