import AppService from 'platform/app-service';

export default function openFile() {
  AppService.openFileDialog().then(fileInfo => {
    this.do.loadFromFile(fileInfo);
  });
}
