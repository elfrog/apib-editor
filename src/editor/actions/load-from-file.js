import ApibParser from '../../parser/apib-parser';

export default async function loadFromFile(fileInfo) {
  let parser = new ApibParser();
  let filename = fileInfo.name;
  let rootNode = await parser.parse(fileInfo.content);

  rootNode.name = filename;

  return {
    rootNode, 
    activeNodeId: rootNode.id
  };
}
