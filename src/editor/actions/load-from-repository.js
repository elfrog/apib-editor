import ApibParser from '../../parser/apib-parser';
import StorageService from 'platform/storage-service';

export default async function loadFromRepository() {
  let savedData = StorageService.get('editor.saved.data');

  if (!savedData) {
    return {};
  }

  let savedName = StorageService.get('editor.saved.name');
  let parser = new ApibParser();
  let root = await parser.parse(savedData);
  
  root.name = savedName;

  return {
    rootNode: root,
    activeNodeId: root.id
  };
}
