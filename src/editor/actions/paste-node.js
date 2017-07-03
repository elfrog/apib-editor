import StorageService from 'platform/storage-service';
import ApibParser from '../../parser/apib-parser';

export default async function pasteNode(node) {
  let data = await StorageService.get('editor.copy.data');

  if (data) {
    let parser = new ApibParser();
    let rootNode = this.state.rootNode.clone();
    let pasteNode = rootNode.findNodeById(node.id);
    let copyNode = parser.createNodeFromJson(data, false);

    pasteNode.addChild(copyNode);

    return {
      rootNode
    };
  }
}
