# TuringBot

TuringBot é um bot desenvolvido para WhatsApp utilizando a biblioteca `@wppconnect-team/wppconnect`. Ele possui funcionalidades para adicionar usuários, criar e listar denúncias, entre outros recursos. O bot envia mensagens de saudação e fornece informações sobre os comandos disponíveis.

## Instalação

Certifique-se de ter o Node.js instalado em seu sistema. Em seguida, siga as etapas abaixo para instalar e executar o TuringBot:

1. Clone o repositório do TuringBot:

   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd TuringBot
   ```

3. Instale as dependências do projeto:

   ```bash
   npm install
   ```

4. Crie as pastas tokens e provas

5. Inicie o bot:

   ```bash
   npm start
   ```

## Utilização

Após iniciar o TuringBot, ele estará pronto para receber mensagens no WhatsApp. Ele responderá automaticamente a certos comandos e enviará saudações com base no horário do dia.

### Comandos disponíveis

- `/addAdmin` - Adiciona um usuário como administrador.
- `/listarAdmins` - Lista os usuários administradores.
- `/delAdmin` - Remove um usuário administrador.
- `/denunciar` - Cria uma denúncia.
- `/listarDenuncias` - Lista todas as denúncias.
- `/mostrarDenuncia DenunciaID` - Mostra os detalhes de uma denúncia específica, substituindo `DenunciaID` pelo ID da denúncia desejada.
- `/delDenuncias` - Deleta todas as denúncias.

### Comando de ajuda

Para obter uma lista dos comandos disponíveis, envie o comando `/help`. Dependendo do tipo de usuário, diferentes comandos serão exibidos:

- Se você for um administrador, receberá uma lista completa de comandos.
- Se você não for um administrador, receberá uma lista reduzida de comandos.

## Observações

- O TuringBot utiliza a biblioteca `@wppconnect-team/wppconnect` para se conectar ao WhatsApp. Certifique-se de revisar a documentação dessa biblioteca para obter informações detalhadas sobre como configurar e utilizar o cliente de WhatsApp.
- O bot envia saudações automaticamente com base no horário local. As mensagens de saudação são enviadas apenas uma vez a cada 24 horas para cada remetente.
- O código do bot está localizado no arquivo `index.js`. Certifique-se de revisar e personalizar o código de acordo com suas necessidades antes de executar o bot.
- O bot responde apenas a mensagens de texto recebidas em conversas individuais (não em grupos).

## Contribuição

Sinta-se à vontade para contribuir com o TuringBot criando pull requests ou relatando problemas na página

do repositório do projeto. Vamos adorar receber seu feedback e melhorar o bot juntos!

## Licença

Este projeto está licenciado sob a licença [MIT](https://opensource.org/licenses/MIT).

---
