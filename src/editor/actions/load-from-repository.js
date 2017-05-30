import ApibParser from '../../parser/apib-parser';
import EditorRepository from '../editor-repository';

export default async function loadFromRepository() {
  let savedData = EditorRepository.getItem('editor.saved.data');

  if (!savedData) {
    return {};
  }

  let savedName = EditorRepository.getItem('editor.saved.name');
  let parser = new ApibParser();
  let root = await parser.parse(savedData);
  
  root.name = savedName;

  return {
    rootNode: root,
    activeNodeId: root.id
  };
}
