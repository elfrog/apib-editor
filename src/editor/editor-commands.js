import ContextMenu from './components/context-menu';

export let editorCommands = {
  newDocument: {
    label: 'New',
    shortcut: 'Ctrl+N',
    onAction: action => action.do.openNewDocument()
  },
  openFile: {
    label: 'Open File',
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
  saveAsFile: {
    label: 'Save As ...',
    shortcut: 'Ctrl+Shift+S',
    onAction: action => {
      action.do.saveAsFile();
    }
  },
  close: {
    label: 'Close',
    onAction: action => {
      action.do.closeProgram();
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

export function getMenuItems(menuData, action) {
  const commands = editorCommands;

  return menuData.map(menu => {
    if (menu === null) {
      return { separator: true };
    }

    if (menu.command) {
      let command = commands[menu.command];

      return {
        label: menu.label,
        disabled: command.disabled ? command.disabled(action) : false,
        onClick: e => {
          command.onAction(action);
          return;
        }
      };
    }

    return {
      label: menu.label,
      onClick: e => {
        ContextMenu.open({
          items: menu.items.map(commandName => {
            if (commandName === null) {
              return { separator: true };
            }

            let command = commands[commandName];

            return {
              label: command.label,
              shortcut: command.shortcut,
              disabled: command.disabled ? command.disabled(action) : false,
              onClick: () => {
                command.onAction(action);
              }
            };
          }),
          target: e.target
        });
      }
    };
  });
}
