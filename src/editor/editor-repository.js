
export default class EditorRepository {
  static defaultValues = {};

  static setItem(key, value) {
    localStorage.setItem(key, value);
  }

  static getItem(key, defaultValue = null) {
    if (localStorage.hasOwnProperty(key)) {
      return localStorage.getItem(key);
    }

    if (key in EditorRepository.defaultValues) {
      return EditorRepository.defaultValues[key];
    }

    return defaultValue;
  }

  static getItemAsNumber(key, defaultValue = null) {
    let value = EditorRepository.getItem(key, defaultValue);

    return Number(value);
  }
}
