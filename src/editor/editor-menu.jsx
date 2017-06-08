
import ContextMenu from './components/context-menu';

import { editorCommands as commands }  from './editor-commands';

const EDITOR_MENU = [
  {
    "label": "File",
    "items": [
      "newDocument",
      "openFile",
      null,
      "saveFile"
    ]
  },
  {
    "label": "Edit",
    "items": [
      "undo",
      "redo",
      null,
      "showSettingsView"
    ]
  },
  {
    "label": "Help",
    "items": [
      "showStartPage"
    ]
  }
];

export function getMenuItems(action) {
  return EDITOR_MENU.map(menu => {
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
