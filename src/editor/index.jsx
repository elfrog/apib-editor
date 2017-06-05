import React from 'react';

import VPanelSplitter from './components/v-panel-splitter';
import Panel from './components/panel';
import ContextMenu from './components/context-menu';
import DragAndDrop from './components/drag-and-drop';
import Toast from './components/toast';
import MenuBar from './components/menu-bar';
import Modal from './components/modal';

import NodeList from './node-list';
import NodeEditor from './node-editor';

import StartPage from './start-page';
import EditorSettingsView from './editor-settings-view';

import EditorRepository from './editor-repository';

import { editorCommands } from './editor-commands';
import { getMenuItems } from './editor-menu';
import { getShortcutString } from '../common/key-utils';

import SolarizedDarkTheme from '../styles/themes/solarized-dark.less';
import SolarizedLightTheme from '../styles/themes/solarized-light.less';

EditorRepository.defaultValues = {
  'editor.saved.data': '',
  'editor.saved.name': '',
  'editor.ui.nodeListPanelSize': 300,
  'editor.ui.nodePropertyViewPanelSize': 300,
  'editor.settings': {
    vimMode: false,
    font: 'Consolas, Monaco',
    fontSize: 14,
    theme: 'Solarized Dark'
  }
};

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.action = props.action;
    this.menuItems = getMenuItems(this.action);

    this.state = {
      settings: EditorRepository.getItem('editor.settings')
    };

    this.changeTheme(this.state.settings.theme);
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

  changeTheme(themeName) {
    if (themeName === 'Solarized Dark') {
      SolarizedLightTheme.unuse();
      SolarizedDarkTheme.use();
    } else {
      SolarizedDarkTheme.unuse();
      SolarizedLightTheme.use();
    }
  }

  onSettingsChange = settings => {
    if (this.state.settings.theme !== settings.theme) {
      this.changeTheme(settings.theme);
    }

    EditorRepository.setItem('editor.settings', settings);
    this.setState({ settings });
  }

  onKeyDown = e => {
    let shortcut = getShortcutString(e);

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
            defaultLeftPanelSize={EditorRepository.getItem('editor.ui.nodeListPanelSize')}
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
              settings={this.state.settings}
              onPropertyChange={this.action.do.changeNodeProperty}
            />
          </VPanelSplitter>
        }
      </div>

      <StartPage action={this.action} />

      <EditorSettingsView
        action={this.action}
        settings={this.state.settings}
        onChange={this.onSettingsChange}
      />

      <ContextMenu />
      <DragAndDrop />
      <Toast />
    </div>;
  }
}
