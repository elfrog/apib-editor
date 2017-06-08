import AppService from 'platform/app-service';

export default async function openFile() {
  let fileInfo = await AppService.openFileDialog();
  return await this.do.loadFromFile(file);
}
