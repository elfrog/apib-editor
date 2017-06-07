
export default function openFile() {
  return new Promise((resolve, reject) => {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
      let file = e.target.files[0];

      if (file) {
        this.do.loadFromFile(file).then(resolve).catch(reject);
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
