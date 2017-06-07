
export default function saveFile() {
  return new Promise((resolve, reject) => {
    let input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('nwsaveas', 'true');
    input.onchange = e => {
      let file = e.target.files[0];

      if (file) {
        ;
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
