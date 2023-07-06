import fs from 'fs';
import util from 'util';

class DownloadUtil {
  constructor(client, path) {
    this.client = client;
    this.path = path;
  }

  generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async downloadMedia(message) {
    const mimeToExtension = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'video/mp4': 'mp4',
      'audio/mpeg': 'mp3',
      'audio/ogg': 'ogg',
      'audio/amr': 'amr',
      'audio/aac': 'aac',
      'audio/wav': 'wav',
      'audio/webm': 'webm',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      'application/pdf': 'pdf',
      'application/rtf': 'rtf',
      'application/zip': 'zip',
      'application/x-rar-compressed': 'rar',
      'application/x-7z-compressed': '7z',
      'text/plain': 'txt',
    };
    

    const mimeType = message.mimetype;
    const extension = mimeToExtension[mimeType.replace(/;.*/, '')];

    if (extension) {
      try {
        const base64data = await this.client.downloadMedia(message);
        const base64image = base64data.replace(/^data:.+;base64,/, '');
        console.log(base64image)
        const randomString = this.generateRandomString(8);
        const fileName = `${this.path}/file-${randomString}.${extension}`;
        await util.promisify(fs.writeFile)(fileName, base64image, 'base64');
        return {fileName, mimeType}
      } catch (error) {
        console.error('Erro ao baixar o arquivo:', error);
        return null;
      }
    } else {
      console.log('Mime type não suportado:', mimeType);
      return null;
    }
  }
}

export default DownloadUtil;
