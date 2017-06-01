
export let editorCommands = {
  newDocument: {
    label: 'New',
    shortcut: 'Ctrl+N',
    onAction: action => action.do.openNewDocument()
  },
  openFromFile: {
    label: 'Open From File',
    shortcut: 'Ctrl+O',
    onAction: action => {
      let input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => {
        let file = e.target.files[0];

        if (file) {
          action.do.loadFromFile(file);
        }
      };
      input.click();
    }
  },
  downloadFile: {
    label: 'Download File',
    shortcut: 'Ctrl+S',
    disabled: action => !action.state.rootNode,
    onAction: action => {
      let content = action.state.rootNode.asString();
      let blob = new Blob([content], { type: 'text/plain' });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = action.state.rootNode.name;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  },
  undo: {
    label: 'Undo',
    shortcut: 'Ctrl+Z',
    disabled: action => !action.history.canUndo(),
    onAction: action => action.history.undo()
  },
  redo: {
    label: 'Redo',
    shortcut: 'Ctrl+Y',
    disabled: action => !action.history.canRedo(),
    onAction: action => action.history.redo()
  },
  showStartPage: {
    label: 'Start Page',
    onAction: action => {
      action.emit('editor.showStartPage');
    }
  },
  showSettingsView: {
    label: 'Settings',
    onAction: action => {
      action.emit('editor.showSettingsView');
    }
  }
};
