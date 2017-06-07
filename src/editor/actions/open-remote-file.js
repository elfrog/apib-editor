
export default function openRemoteFile(fileName, remoteUrl) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', remoteUrl, true);
    xhr.responseType = 'text';
    xhr.onload = e => {
      if (xhr.status == 200) {
        let content = xhr.response;
        let file = new File([content], fileName, {
          type: 'text/plain'
        });

        this.do.loadFromFile(file).then(resolve).catch(reject);
      } else {
        reject(new Error('Couldn\'t load a remote file: ' + fileName));
      }
    };
    xhr.onerror = e => reject(e);
    xhr.send();
  });
}
