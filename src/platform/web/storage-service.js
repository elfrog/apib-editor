
export default class StorageService {
  static values = {};

  static setValues(values) {
    StorageService.values = Object.assign({}, StorageService.values, values);
  }

  static set(key, value) {
    StorageService.values[key] = value;
  }

  static get(key, defaultValue = undefined) {
    if (StorageService.values.hasOwnProperty(key)) {
      return StorageService.values[key];
    }

    return defaultValue;
  }

  static async save() {
    let serialized = JSON.stringify(StorageService.values);
    localStorage.setItem('apibStorage', serialized);
  }

  static async load() {
    let serialized = localStorage.getItem('apibStorage');

    if (serialized) {
      let values = JSON.parse(serialized);
      StorageService.setValues(values);
    }
  }
}
