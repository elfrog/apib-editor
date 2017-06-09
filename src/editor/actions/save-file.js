import AppService from 'platform/app-service';
import StorageService from 'platform/storage-service';

export default async function saveFile() {
  let rootNode = this.state.rootNode;
  let name = await StorageService.get('editor.saved.name');
  let path = await StorageService.get('editor.saved.path');

  if (!path) {
    AppService.openSaveAsDialog(rootNode.name).then(fileInfo => {
      StorageService.setValues({
        'editor.saved.name': fileInfo.name,
        'editor.saved.path': fileInfo.path
      });

      AppService.saveFile({
        name: fileInfo.name,
        path: fileInfo.path,
        content: rootNode.asString()
      });
    });
  } else {
    await AppService.saveFile({
      name,
      path,
      content: rootNode.asString()
    });
  }
}
