import UserService from "../service/userService.js";
import PhoneNumber from 'libphonenumber-js';

class UserController {
  constructor(client) {
    this.client = client;
  }

  async addUsuario(message) {
    if (await this.verificacao(message) == true) {
      await this.client.sendText(message.from, 'Qual é o nome?');
      const userNomePromise = new Promise((resolve) => {
        const listener = (userMessage) => {
          if (userMessage.from === message.from) {
            resolve(userMessage);
          }
        };
        this.client.onMessage(listener);
      });

      const nome = await userNomePromise;

      await this.client.sendText(message.from, 'Qual é o telefone?\n Obs: Não coloque o 9');
      const userTelefonePromise = new Promise((resolve) => {
        const listener = (userMessage) => {
          if (userMessage.from === message.from) {
            resolve(userMessage);
          }
        };
        this.client.onMessage(listener);
      });

      const telefone = await userTelefonePromise;

      try {
        await UserService.createUser(nome.body, telefone.body);
        this.client.sendText(message.from, 'Usuário adicionado com sucesso!');
      } catch (error) {
        console.log(error);
        this.client.sendText(message.from, 'Houve um erro interno!');
      }
    }
  }

  async listarUsuarios(message) {
    if (await this.verificacao(message) == true){
        await this.client.sendText(message.from, 'Listando usuários...');
        try {
            const result = await UserService.listUsers();
            if (result.length > 0) {
            const formattedMessage = result.map(user => `Usuário ID ${user.id}:\n\n${user.name}\n${user.telefone}`).join('\n\n');
            await this.client.sendText(message.from, formattedMessage);
            } else {
            this.client.sendText(message.from, 'Não foram encontrados usuários.');
            }
        } catch (error) {
            console.log(error);
            this.client.sendText(message.from, 'Houve um erro interno!');
        }
    }
  }
  

    async removerUsuario(message) {
        if (await this.verificacao(message) == true) {
            await this.client.sendText(message.from, 'Qual é o ID do usuário?');
            const userNomePromise = new Promise((resolve) => {
            const listener = (userMessage) => {
                if (userMessage.from === message.from) {
                resolve(userMessage);
                }
            };
            this.client.onMessage(listener);
            });
    
            const id = await userNomePromise;
    
            try {
            await UserService.deleteUser(id.body);
            this.client.sendText(message.from, 'Usuário removido com sucesso!');
            } catch (error) {
            console.log(error);
            this.client.sendText(message.from, 'Houve um erro interno!');
            }
        }
    }

    async verificacao(message) {
        const usuarios = await UserService.listUsers();
        const from = message.from;
      
        for (const usuario of usuarios) {
          console.log(PhoneNumber(usuario.telefone, 'BR').nationalNumber);
          console.log(PhoneNumber(from, 'BR').nationalNumber);
      
          if (PhoneNumber(usuario.telefone, 'BR').nationalNumber === PhoneNumber(from, 'BR').nationalNumber) {
            return true; // Sai da função e retorna true
          }
        }
      
        return false; // Sai da função e retorna false
      }
      

}


export default UserController;