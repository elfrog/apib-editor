import ApibParser from '../../parser/apib-parser';

export default function loadFromFile(file) {
  let parser = new ApibParser();
  let filename = file.name;

  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = e => {
      parser.parse(e.target.result).then(root => {
        root.name = filename;

        resolve({
          rootNode: root,
          activeNodeId: root.id
        });
      }).catch(reject);
    };
    reader.onerror = e => {
      reject(e);
    };
    reader.readAsText(file);
  });
}
