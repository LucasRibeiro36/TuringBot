import wppconnect from '@wppconnect-team/wppconnect';
import DenunciaController from './controller/denunciaController.js';
import UserController from './controller/userController.js';
import DownloadUtil from './util/DownloadUtil.js';

class WhatsAppBot {
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
        session: 'Bot-Denuncie',
        puppeteerOptions: {
          userDataDir: './tokens/Bot-Denuncie', // or your custom directory
          headless: true,
        },
        // ...
      });

      this.denunciaController = new DenunciaController(this.client);
      this.userController = new UserController(this.client);

      this.client.onMessage(this.handleMessage.bind(this));
    } catch (error) {
      console.log(error);
    }
  }

  async handleMessage(message) {
    if (!message.isGroupMsg) {
      console.log(message);
      if (message.body === '/addUsuario') {
        this.userController.addUsuario(message);
      } else if (message.body === '/listarUsuarios') {
        this.userController.listarUsuarios(message);
      } else if (message.body === '/delUsuario') {
        this.userController.removerUsuario(message);
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
              "/addUsuario - Adiciona um usuário\n" +
              "/listarUsuarios - Lista os usuários\n" +
              "/delUsuario - Remove um usuário\n" +
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
      } else {
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
            additionalMessage = 'Agradecemos por nos contatar durante a noite. Como podemos ajudar?';
          } else if (hour >= 4 && hour < 12) {
            greetingMessage = 'Bom dia';
            additionalMessage = 'Tenha um ótimo dia! Em que podemos auxiliar?';
          } else if (hour >= 12 && hour < 18) {
            greetingMessage = 'Boa tarde';
            additionalMessage = 'Esperamos que seu dia esteja indo bem. Como podemos ser úteis?';
          } else {
            greetingMessage = 'Boa noite';
            additionalMessage = 'Obrigado por entrar em contato. Como podemos ajudar?';
          }

          const fullMessage = `${greetingMessage}, seja bem-vindo(a) sou o DenuncieBot!!!\n${additionalMessage}`;
          this.client.sendText(message.from, fullMessage);
        }


      }
    }
  }
}

const bot = new WhatsAppBot();
bot.start();
