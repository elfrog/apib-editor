
import ContextMenu from './components/context-menu';

import { editorCommands as commands }  from './editor-commands';

function openMenu(action, commandItems) {
  return function (e) {
    ContextMenu.open({
      items: commandItems.map(command => makeMenuItem(action, command)),
      target: e.target
    });
  }
}

function makeMenuItem(action, command) {
  if (command === null) {
    return { separator: true };
  }

  return {
    label: command.label,
    shortcut: command.shortcut,
    disabled: command.disabled ? command.disabled(action) : false,
    onClick: () => {
      command.onAction(action);
    }
  };
}

export function getMenuItems(action) {
  return [
    {
      label: 'File',
      onClick: openMenu(action, [
        commands.newDocument,
        commands.openFromFile,
        null,
        commands.downloadFile
      ])
    },
    {
      label: 'Edit',
      onClick: openMenu(action, [
        commands.undo,
        commands.redo
      ])
    },
    {
      label: 'Help',
      onClick: openMenu(action, [
        commands.showStartPage
      ])
    }
  ];
}
