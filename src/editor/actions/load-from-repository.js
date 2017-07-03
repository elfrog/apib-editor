import ApibParser from '../../parser/apib-parser';
import StorageService from 'platform/storage-service';

export default function loadFromRepository() {
  let savedData = StorageService.get('editor.saved.data');

  if (!savedData) {
    return {};
  }

  let savedName = StorageService.get('editor.saved.name');
  let activeNodeId = StorageService.get('editor.saved.activeNodeId');
  let parser = new ApibParser();
  let rootNode = parser.createNodeFromJson(savedData);
  
  rootNode.name = savedName;

  return {
    rootNode,
    activeNodeId
  };
}
