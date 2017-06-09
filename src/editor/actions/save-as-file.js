import AppService from 'platform/app-service';
import StorageService from 'platform/storage-service';

export default function saveAsFile() {
  let rootNode = this.state.rootNode;

  AppService.openSaveAsDialog(rootNode.name).then(fileInfo => {
    let name = fileInfo.name;
    let path = fileInfo.path;

    StorageService.setValues({
      'editor.saved.name': name,
      'editor.saved.path': path
    });

    AppService.saveFile({
      name,
      path,
      content: rootNode.asString()
    });
  });
}
