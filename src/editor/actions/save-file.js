import AppService from 'platform/app-service';

export default function saveFile() {
  let rootNode = this.state.rootNode;

  AppService.saveFile({
    name: rootNode.name,
    content: rootNode.asString()
  });
}
