import AppService from 'platform/app-service';
import StorageService from 'platform/storage-service';

export default async function saveFile() {
  let rootNode = this.state.rootNode;
  let name = await StorageService.get('editor.saved.name');
  let path = await StorageService.get('editor.saved.path');

  if (!path) {
    let fileInfo = await AppService.openSaveAsDialog(rootNode.name);

    name = fileInfo.name;
    path = fileInfo.path;

    await StorageService.setValues({
      'editor.saved.name': name,
      'editor.saved.path': path
    });
  }

  await AppService.saveFile({
    name,
    path,
    content: rootNode.asString()
  });
}
