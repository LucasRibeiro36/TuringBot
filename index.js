import wppconnect from '@wppconnect-team/wppconnect';
import DenunciaController from './controller/denunciaController.js';
import UserController from './controller/userController.js';
import DownloadUtil from './util/DownloadUtil.js';
import StickerController from './controller/stickerController.js';

class TuringBot {
  constructor() {
    this.client = null;
    this.denunciaController = null;
    this.userController = null;
    this.sentGreetings = new Map();
  }

  async start() {
    try {
      this.client = await wppconnect.create({
        // ...
        session: 'TuringBot',
        puppeteerOptions: {
          userDataDir: './tokens/TuringBot', // or your custom directory
          headless: true,
        },
        // ...
      });

      this.denunciaController = new DenunciaController(this.client);
      this.userController = new UserController(this.client);
      this.stickerController = new StickerController(this.client);

      this.client.onMessage(this.handleMessage.bind(this));
    } catch (error) {
      console.log(error);
    }
  }

  async handleMessage(message) {
    if (!message.isGroupMsg) {
      console.log(message);
      if (message.body === '/addAdmin') {
        this.userController.addAdmin(message);
      } else if (message.body === '/listarAdmins') {
        this.userController.listarAdmins(message);
      } else if (message.body === '/delAdmin') {
        this.userController.removerAdmin(message);
      } else if (message.body === '/denunciar') {
        this.denunciaController.criarDenuncia(message);
      } else if (message.body === '/listarDenuncias') {
        this.denunciaController.listarDenuncias(message);
      } else if (message.body === '/delDenuncias') {
        this.denunciaController.deletarDenuncias(message);
      } else if (message.body === "/help") {
          if (await this.userController.verificacao(message)) {
            const helpMessage =
              "Comandos disponíveis:\n" +
              "/addAdmin - Adiciona um usuário\n" +
              "/listarAdmins - Lista os usuários\n" +
              "/delAdmin - Remove um usuário\n" +
              "/denunciar - Cria uma denúncia\n" +
              "/listarDenuncias - Lista as denúncias\n" +
              "/mostrarDenuncia - Mostra uma denúncia\nExemplo: /mostrarDenuncia DenunciaID\n" +
              "/delDenuncias - Deleta as denúncias";
            this.client.sendText(message.from, helpMessage);
          } else {
            const helpMessage = "Comandos disponíveis:\n" +
              "/denunciar - Cria uma denúncia";
            this.client.sendText(message.from, helpMessage);
          }
      } else if (message.body.split(' ')[0] === "/mostrarDenuncia"){
        this.denunciaController.mostrarDenuncia(message);
      } else if (message.caption === "/sticker"){
        this.stickerController.createSticker(message);
      }else {
        const GREETING_INTERVAL = 24 * 60 * 60 * 1000; // Intervalo de 24 horas em milissegundos

        const lastGreetingTime = this.sentGreetings.get(message.from);
        const currentTime = new Date();
        const timeDiff = lastGreetingTime ? currentTime - lastGreetingTime : Infinity;

        if (!lastGreetingTime || timeDiff >= GREETING_INTERVAL) {
          this.sentGreetings.set(message.from, currentTime);
          const hour = currentTime.getHours();
          let greetingMessage = '';
          let additionalMessage = '';

          if (hour >= 0 && hour < 4) {
            greetingMessage = 'Boa noite';
            additionalMessage = 'Agradecemos por nos contatar durante a noite.\nDigite /help para ver os comandos disponíveis';
          } else if (hour >= 4 && hour < 12) {
            greetingMessage = 'Bom dia';
            additionalMessage = 'Tenha um ótimo dia! \nDigite /help para ver os comandos disponíveis';
          } else if (hour >= 12 && hour < 18) {
            greetingMessage = 'Boa tarde';
            additionalMessage = 'Esperamos que seu dia esteja indo bem. \nDigite /help para ver os comandos disponíveis';
          } else {
            greetingMessage = 'Boa noite';
            additionalMessage = 'Obrigado por entrar em contato. \nDigite /help para ver os comandos disponíveis';
          }

          const fullMessage = `${greetingMessage}, seja bem-vindo(a) sou o TuringBot!!!\n${additionalMessage}`;
          this.client.sendText(message.from, fullMessage);
        }


      }
    }
  }
}

const bot = new TuringBot();
bot.start();
