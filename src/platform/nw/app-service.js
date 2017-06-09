import fs from 'fs';
import http from 'http';
import https from 'https';

export default class AppService {
  static setup() {
    ;
  }

  static async openFileDialog() {
    return new Promise((resolve, reject) => {
      let input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => {
        let file = e.target.files[0];

        if (file) {
          loadTextFile(file).then(content => {
            resolve({
              name: file.name,
              content,
              path: file.name
            });
          });
        } else {
          reject(new Error('No file selected.'));
        }
      };
      input.onerror = e => {
        reject(e);
      };
      input.click();
    });
  }

  static async openSaveAsDialog(defaultFileName) {
    return new Promise((resolve, reject) => {
      let input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('nwsaveas', defaultFileName || '');
      input.onchange = e => {
        let file = e.target.files[0];

        if (file) {
          resolve({
            name: file.name,
            path: file.path
          });
        } else {
          reject(new Error('No file selected.'));
        }
      };
      input.onerror = e => {
        reject(e);
      };
      input.click();
    });
  }

  static async saveFile(fileInfo) {
    return Promise.resolve();
  }

  static async loadRemoteContent(remoteUrl) {
    let req = remoteUrl.startsWith('https') ? https : http;

    return new Promise((resolve, reject) => {
      req.get(remoteUrl, res => {
        if (res.statusCode === 200) {
          let body = '';
          res.setEncoding('utf8');
          res.on('data', data => body += data);
          res.on('end', () => {
            resolve(body);
          });
        } else {
          reject(new Error('Request failed (Status ' + res.statusCode + ')'));
        }
      });
    });
  }
}
