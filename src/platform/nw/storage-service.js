import fs from 'fs';

export default class StorageService {
  static STORAGE_PATH = 'settings.json';
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
    let data = JSON.stringify(StorageService.values, null, 2);

    return new Promise((resolve, reject) => {
      fs.writeFile(StorageService.STORAGE_PATH, data, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async load() {
    return new Promise((resolve, reject) => {
      fs.readFile(StorageService.STORAGE_PATH, { encoding: 'utf8' }, (err, data) => {
        if (err) {
          resolve();
        } else {
          let values = JSON.parse(data);
          StorageService.setValues(values);
          resolve();
        }
      });
    });
  }
}
