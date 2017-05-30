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

import EditorRepository from './editor-repository';

import { editorCommands } from './editor-commands';
import { getMenuItems } from './editor-menu';

EditorRepository.defaultValues = {
  'editor.saved.data': null,
  'editor.saved.name': null,
  'editor.ui.nodeListPanelSize': 300,
  'editor.ui.nodePropertyViewPanelSize': 300,
  'editor.options.vimMode': false,
  'editor.options.font': 'Consolas, Monaco',
  'editor.options.fontSize': 14,
  'editor.options.theme': 'Solarized Dark'
};

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.action = props.action;
    this.menuItems = getMenuItems(this.action);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.storeEditorState);
    document.addEventListener('keydown', this.onKeyDown);

    this.action.do.loadFromRepository();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.storeEditorState);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  storeEditorState = () => {
    let rootNode = this.action.state.rootNode;

    if (rootNode) {
      let data = rootNode.asString();

      EditorRepository.setItem('editor.saved.data', data);
      EditorRepository.setItem('editor.saved.name', rootNode.name);
    }
  }

  onKeyDown = e => {
    let keys = [];

    if (e.altKey) {
      keys.push('Alt');
    }

    if (e.ctrlKey) {
      keys.push('Ctrl');
    }

    if (e.shiftKey) {
      keys.push('Shift');
    }

    if (keys.length === 0) {
      return;
    }

    keys.push(e.key.toUpperCase());

    let shortcut = keys.join('+');

    for (let commandName in editorCommands) {
      let command = editorCommands[commandName];

      if (command.shortcut === shortcut) {
        if (command.disabled && command.disabled(this.action) === true) {
          return;
        }

        command.onAction(this.action);

        e.preventDefault();
        e.stopPropagation();
        break;
      }
    }
  }

  render() {
    let activeNode = this.props.rootNode ? this.props.rootNode.findNodeById(this.props.activeNodeId) : null;

    return <div className='apib-editor'>
      <div className='apib-editor-menu'>
        <MenuBar items={this.menuItems} />
      </div>

      <div className='apib-editor-content'>      
        {activeNode &&
          <VPanelSplitter
            defaultLeftPanelSize={EditorRepository.getItemAsNumber('editor.ui.nodeListPanelSize')}
            onPanelSizeChange={size => EditorRepository.setItem('editor.ui.nodeListPanelSize', size)}
          >
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
