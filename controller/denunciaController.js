import ServiceDenuncia from '../service/denunciaService.js';
import userController from './userController.js';
import DownloadUtil from '../util/DownloadUtil.js';

class DenunciaController {
  constructor(client) {
    this.client = client;
    this.userController = new userController(this.client);
    this.downloadUtil = new DownloadUtil(this.client, './provas');
  }

  async criarDenuncia(message) {
    await this.client.sendText(message.from, 'Qual é a sua denúncia?');

    // Cria uma promessa para aguardar a mensagem do usuário
    const userMessagePromise = new Promise((resolve) => {
      const listener = (userMessage) => {
        // Verifica se a mensagem é do usuário e resolve a promessa
        if (userMessage.from === message.from) {
          if (message.mimetype){
            this.client.sendText(message.from, 'Não entendi, envie a denúncia em formato de texto, as provas são enviadas depois');
          }
          resolve(userMessage);
        }
      };

      // Adiciona o listener para capturar a mensagem do usuário
      this.client.onMessage(listener);
    });

    // Aguarda a resolução da promessa e captura a mensagem do usuário
    const userMessage = await userMessagePromise;
    console.log('Mensagem do usuário:', userMessage);
    this.client.sendText(message.from, 'Envie as provas da denúncia\nQuando terminar, digite /enviar, caso não queira enviar provas, digite /enviar sem enviar nada');

    // Cria uma promessa para aguardar o envio das provas
    const userProvasPromise = new Promise((resolve) => {
      const provas = [];

      const listener = (userMessage) => {
        // Verifica se a mensagem é do usuário
        if (userMessage.from === message.from) {
          if (userMessage.body === '/enviar') {
            resolve(provas);
          } else if (userMessage.mimetype) {
            provas.push(this.downloadUtil.downloadMedia(userMessage));
          } else {
            this.client.sendText(message.from, 'Não entendi, envie as provas da denúncia em formato de arquivo');
          }
        }
      };

      // Adiciona o listener para capturar as mensagens do usuário
      this.client.onMessage(listener);
    });

    // Aguarda a resolução da promessa e captura as provas do usuário
    const userProvas = await userProvasPromise;
    console.log('Provas:', userProvas);

    // Resolve as promessas das provas para obter os valores reais
    const provas = await Promise.all(userProvas);
    console.log('Provas resolvidas:', provas);

    // Faça o processamento necessário com a mensagem do usuário e as provas
    const date = new Date(userMessage.timestamp * 1000);
    console.log(userMessage.from, userMessage.body, date, provas);

    await ServiceDenuncia.criarDenuncia(userMessage.from, userMessage.body, date, provas)
      .then(async (result) => {
        console.log(result);
        // Envie uma mensagem de confirmação para o usuário
        await this.client.sendText(userMessage.from, 'Denúncia recebida com sucesso!');
        await this.deleteChat(message.from);
      })
      .catch(async (error) => {
        console.log(error);
        // Envie uma mensagem de confirmação para o usuário
        await this.client.sendText(userMessage.from, 'Houve um erro interno!');
        await this.deleteChat(message.from);
      });
  }

  async deleteChat(chatId) {
    try {
      // Exclua o chat usando a API do WhatsApp
      await this.client.deleteChat(chatId);
      console.log(`O chat ${chatId} foi excluído.`);
    } catch (error) {
      console.error('Erro ao excluir o chat:', error);
    }
  }

  async listarDenuncias(message) {
    if (await this.userController.verificacao(message) == true) {
      await this.client.sendText(message.from, 'Listando denúncias...');
      try {
        const result = await ServiceDenuncia.listarDenuncias();
        if (result.length > 0) {
          // Formate os resultados como desejar e envie a mensagem de resposta
          for (let denuncia of result) {
            console.log(denuncia);
            const formattedMessage = `Denúncia ID ${denuncia.id} em ${denuncia.date}:\n\n${denuncia.msg} \n\nProvas:\n${denuncia.provas.length}`;
            await this.client.sendText(message.from, formattedMessage);
          }
        } else {
          // Caso não haja denúncias, envie uma mensagem informando ao usuário
          this.client.sendText(message.from, 'Não foram encontradas denúncias.');
        }
      } catch (error) {
        console.log(error);
        // Em caso de erro, envie uma mensagem informando ao usuário
        this.client.sendText(message.from, 'Houve um erro interno!');
      }
    }
  }

  async mostrarDenuncia(message) {
    if (await this.userController.verificacao(message) == true) {
      await this.client.sendText(message.from, 'Mostrando denúncia...');
      try {
        const result = await ServiceDenuncia.buscarDenunciaPorId(message.body.split(' ')[1]);
        if (result) {
          const formattedMessage = `Denúncia ID ${result.id} em ${result.date}:\n\n${result.msg} \n\nProvas:\n${result.provas.length}`;
          await this.client.sendText(message.from, formattedMessage);
          if (result.provas.length > 0) {
            for (let prova of result.provas) {
              await this.client.sendFile(message.from, prova.fileName);
            }
          }
        } else {
          this.client.sendText(message.from, 'Denúncia não encontrada.');
        }
      } catch (error) {
        console.log(error);
        this.client.sendText(message.from, 'Houve um erro interno!');
      }
    }
  }
  
  


  async deletarDenuncias(message) {
    if (await this.userController.verificacao(message) == true) {
      await this.client.sendText(message.from, 'Deletando denúncias...');
      try {
        const result = await ServiceDenuncia.listarDenuncias();
        if (result.length > 0) {
          await ServiceDenuncia.deletarDenuncias()
            .then((result) => {
              console.log(result);
              // Envie uma mensagem de confirmação para o usuário
              this.client.sendText(message.from, 'Denúncias deletadas com sucesso!');
            })
            .catch((error) => {
              console.log(error);
              // Envie uma mensagem de confirmação para o usuário
              this.client.sendText(message.from, 'Houve um erro interno!');
            });
        } else {
          // Caso não haja denúncias, envie uma mensagem informando ao usuário
          this.client.sendText(message.from, 'Não foram encontradas denúncias.');
        }
      } catch (error) {
        console.log(error);
        // Em caso de erro, envie uma mensagem informando ao usuário
        this.client.sendText(message.from, 'Houve um erro interno!');
      }
    }
  }
}

export default DenunciaController;
