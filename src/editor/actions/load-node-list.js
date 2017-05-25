import apiData from 'raw-loader!../../../../test.apib';
import ApibParser from '../../parser/apib-parser';

export default function loadNodeList() {
  let parser = new ApibParser();

  return new Promise((resolve) => {
    parser.parse(apiData).then(root => {
      resolve({
        rootNode: root,
        nodeList: root.flatten()
      });
    });
  });
}
