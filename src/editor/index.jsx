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

import AppService from 'platform/app-service';
import StorageService from 'platform/storage-service';
import { EDITOR_MENU } from 'platform/editor-menu';

import { editorCommands, getMenuItems } from './editor-commands';
import { getShortcutString } from '../common/key-utils';

import SolarizedDarkTheme from '../styles/themes/solarized-dark.less';
import SolarizedLightTheme from '../styles/themes/solarized-light.less';

// Set default storage values.
StorageService.setValues({
  'editor.saved.data': '',
  'editor.saved.name': '',
  'editor.saved.path': '',
  'editor.saved.activeNodeId': null,
  'editor.ui.nodeListPanelSize': 300,
  'editor.ui.nodePropertyViewPanelSize': 300,
  'editor.settings': {
    vimMode: false,
    font: 'Consolas, Monaco',
    fontSize: 14,
    theme: 'Solarized Dark'
  }
});

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.action = props.action;

    this.state = {
      settings: StorageService.get('editor.settings'),
      loading: true
    };
  }

  componentDidMount() {
    AppService.addEventListener('beforeunload', this.onClose);
    document.addEventListener('keydown', this.onKeyDown);

    StorageService.load().then(() => {
      let settings = StorageService.get('editor.settings'); 

      this.setState({
        settings, 
        loading: false
      });

      this.action.do.loadFromRepository();
      this.changeTheme(settings.theme);
      this.changeFont(settings.font, settings.fontSize);
    });
  }

  componentWillUnmount() {
    AppService.removeEventListener('beforeunload', this.onClose);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  changeFont(fontFamily, fontSize) {
    let sheet = document.getElementById('fontStyle');

    if (!sheet) {
      sheet = document.createElement('style');
      sheet.id = 'fontStyle';
      document.body.appendChild(sheet);
    }

    sheet.innerHTML = `
      html { font-family: ${fontFamily}; font-size: ${fontSize}px }
      input, select, .control { font-family: ${fontFamily}; font-size: ${fontSize}px }
    `;
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

  onClose = async (e) => {
    e.preventDefault();

    let rootNode = this.action.state.rootNode;

    if (rootNode) {
      let data = rootNode.asJson();

      StorageService.set('editor.saved.data', data);
      StorageService.set('editor.saved.name', rootNode.name);
      StorageService.set('editor.saved.activeNodeId', this.action.state.activeNodeId);
    }

    await StorageService.save();
    AppService.close();
  }

  onSettingsChange = settings => {
    if (this.state.settings.theme !== settings.theme) {
      this.changeTheme(settings.theme);
    }

    if (this.state.settings.font !== settings.font || this.state.settings.fontSize !== settings.fontSize) {
      this.changeFont(settings.font, settings.fontSize);
    }

    StorageService.set('editor.settings', settings);
    StorageService.save();

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
    let menuItems = getMenuItems(EDITOR_MENU, this.action);

    return <div className='apib-editor'>
      {this.state.loading === false && 
        <div>
          <div className='apib-editor-menu'>
            <MenuBar items={menuItems} />
          </div>

          <div className='apib-editor-content'>      
            {activeNode &&
              <VPanelSplitter
                defaultLeftPanelSize={StorageService.get('editor.ui.nodeListPanelSize')}
                onPanelSizeChange={size => StorageService.set('editor.ui.nodeListPanelSize', size)}
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
                  onCopyNode={this.action.do.copyNode}
                  onPasteNode={this.action.do.pasteNode}
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
        </div>
      }

      <ContextMenu />
      <DragAndDrop />
      <Toast />
    </div>;
  }
}
