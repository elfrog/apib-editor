import React from 'react';

import VPanelSplitter from './components/v-panel-splitter';
import Panel from './components/panel';
import ContextMenu from './components/context-menu';
import DragAndDrop from './components/drag-and-drop';
import Toast from './components/toast';
import MenuBar from './components/menu-bar';

import StartPage from './start-page';

import NodeList from './node-list';
import NodeEditor from './node-editor';

import { getMenuItems } from './editor-menu';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.action = props.action;
    this.menuItems = getMenuItems(this.action);
  }

  render() {
    let activeNode = this.props.rootNode ? this.props.rootNode.findNodeById(this.props.activeNodeId) : null;

    return <div className='apib-editor'>
      <div className='apib-editor-menu'>
        <MenuBar items={this.menuItems} />
      </div>

      <div className='apib-editor-content'>      
        {activeNode &&
          <VPanelSplitter>
            <NodeList
              rootNode={this.props.rootNode}
              activeNode={activeNode}
              filter={this.props.nodeListFilter}
              onFilter={this.action.do.filterNodeList}
              onSelect={this.action.do.selectNode}
              onAddNode={this.action.do.addChildNode}
              onRemoveNode={this.action.do.removeChildNode}
              onChangeNodeIndex={this.action.do.changeNodeIndex}
            />
            <NodeEditor
              rootNode={this.props.rootNode}
              activeNode={activeNode}
              onPropertyChange={this.action.do.changeNodeProperty}
            />
          </VPanelSplitter>
        }

        {activeNode === null &&
          <StartPage
            onOpenFile={this.action.do.loadFromFile}
            onNewFile={this.action.do.openNewDocument}
          />
        }
      </div>

      <ContextMenu />
      <DragAndDrop />
      <Toast />
    </div>;
  }
}
