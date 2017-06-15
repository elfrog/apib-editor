import fs from 'fs';
import EventEmitter from 'eventemitter3';

export default class AppService {
  static emitter = new EventEmitter();
  static closing = false;

  static setup() {
    nw.Window.get().on('close', function () {
      let defaultPrevented = false;

      this.hide();

      AppService.closing = true;
      AppService.emitter.emit('beforeunload', {
        preventDefault: () => {
          defaultPrevented = true;
        }
      });

      if (!defaultPrevented) {
        AppService.close();
      }
    });
  }

  static addEventListener(eventName, thunk) {
    AppService.emitter.on(eventName, thunk);
  }

  static removeEventListener(eventName, thunk) {
    AppService.emitter.off(eventName, thunk);
  }

  static close() {
    nw.Window.get().close(AppService.closing);
  }

  static async openFileDialog() {
    return new Promise((resolve, reject) => {
      let input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => {
        let file = e.target.files[0];

        if (file) {
          fs.readFile(file.path, { encoding: 'utf8' }, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                name: file.name,
                content: data,
                path: file.path
              });
            }
          });
        } else {
          reject(new Error('No file selected.'));
        }
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
      input.click();
    });
  }

  static async saveFile(fileInfo) {
    return new Promise((resolve, reject) => {
      fs.writeFile(fileInfo.path, fileInfo.content, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async loadRemoteContent(remoteUrl) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('get', remoteUrl, true);
      xhr.responseType = 'text';
      xhr.onload = e => {
        if (xhr.status == 200) {
          let content = xhr.response;

          resolve(content);
        } else {
          reject(new Error('Couldn\'t load remote content: ' + remoteUrl));
        }
      };
      xhr.onerror = e => reject(e);
      xhr.send();
    });
  }
}
