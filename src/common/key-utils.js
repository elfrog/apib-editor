
export function getShortcutString(e) {
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
    return '';
  }

  keys.push(e.key.toUpperCase());

  let shortcut = keys.join('+');

  return shortcut;
}
