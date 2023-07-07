import sharp from 'sharp';
import fs from 'fs';
import util from 'util';

class StickerController {
  constructor(client) {
    this.client = client;
  }

  async generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async createSticker(message) {
    if (message.mimetype.includes('image')) {
      const buffer = await this.client.decryptFile(message);

      const resizedBuffer = await sharp(buffer)
        .resize(512, 512, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFormat('png')
        .toBuffer();

      const base64String = `data:image/png;base64,${resizedBuffer.toString('base64')}`;
      console.log(base64String);

      await this.client.sendImageAsSticker(message.from, base64String);
    }
  }
}

export default StickerController;
