
export default class EditorRepository {
  static defaultValues = {};

  static setItem(key, value) {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }

  static getRawItem(key) {
    if (localStorage.hasOwnProperty(key)) {
      return localStorage.getItem(key);
    }

    return undefined;
  }

  static getDefaultValue(key) {
    return EditorRepository.defaultValues[key];
  }

  static getItem(key) {
    let value = EditorRepository.getRawItem(key);
    let defaultValue = EditorRepository.getDefaultValue(key);

    switch (typeof defaultValue) {
    case 'string': return value;
    case 'number': return Number(value);
    case 'object': return JSON.parse(value);
    }

    return undefined;
  }
}
