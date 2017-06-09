
function loadTextFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = e => {
      resolve(e.target.result);
    };
    reader.onerror = e => reject(e);
    reader.readAsText(file);
  });
}

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
    return Promise.resolve({
      name: defaultFileName,
      path: defaultFileName
    });
  }

  static async saveFile(fileInfo) {
    let blob = new Blob([fileInfo.content], { type: 'text/plain' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.name;
    a.click();
    window.URL.revokeObjectURL(url);
    return Promise.resolve();
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
