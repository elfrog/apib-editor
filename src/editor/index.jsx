import React from 'react';

import VPanelSplitter from './components/v-panel-splitter';
import Panel from './components/panel';

import NodeList from './node-list';
import NodeEditor from './node-editor';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.action = props.action;
  }

  render() {
    let activeNode = this.props.rootNode ? this.props.rootNode.findNodeById(this.props.activeNodeId) : null;

    return <div className='apib-editor'>
      <VPanelSplitter>
        <NodeList
          rootNode={this.props.rootNode}
          activeNode={activeNode}
          filter={this.props.nodeListFilter}
          onFilter={this.action.do.filterNodeList}
          onSelect={this.action.do.selectNode}
        />

        {this.props.activeNodeId ?
          <NodeEditor
            node={activeNode}
            onPropertyChange={this.action.do.changeNodeProperty}
          />
          :
          <div className='apib-editor-message'>
            Please select a node from list.
          </div>
        }
      </VPanelSplitter>
    </div>;
  }
}
