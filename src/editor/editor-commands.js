
export let editorCommands = {
  newDocument: {
    label: 'New',
    shortcut: 'Ctrl+N',
    onAction: action => action.do.openNewDocument()
  },
  openFile: {
    label: 'Open From File',
    shortcut: 'Ctrl+O',
    onAction: action => {
      action.do.openFile();
    }
  },
  saveFile: {
    label: 'Save',
    shortcut: 'Ctrl+S',
    onAction: action => {
      action.do.saveFile();
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
      action.emit('editor:showStartPage');
    }
  },
  showSettingsView: {
    label: 'Settings',
    onAction: action => {
      action.emit('editor:showSettingsView');
    }
  }
};
