import StorageService from 'platform/storage-service';

export default function copyNode(node) {
  let data = node.asJson();

  StorageService.set('editor.copy.data', data);
  StorageService.set('editor.copy.name', node.name);
}
