import AppService from 'platform/app-service';

export default async function openRemoteFile(fileName, remoteUrl) {
  let content = await AppService.loadRemoteContent(remoteUrl);

  return await this.do.loadFromFile({
    name: fileName,
    content
  });
}
