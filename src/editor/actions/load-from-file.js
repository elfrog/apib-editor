import StorageService from 'platform/storage-service';
import ApibParser from '../../parser/apib-parser';

export default async function loadFromFile(fileInfo) {
  let parser = new ApibParser();
  let filename = fileInfo.name;
  let rootNode = parser.parse(fileInfo.content);

  rootNode.name = filename;

  await StorageService.setValues({
    'editor.saved.name': fileInfo.name,
    'editor.saved.path': fileInfo.path
  });

  return {
    rootNode, 
    activeNodeId: rootNode.id
  };
}
