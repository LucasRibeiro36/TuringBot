import Denuncia from '../model/denunciaModel.js';
import Prova from '../model/provaModel.js';
import sequelize from '../config/database.js';
import fs from 'fs';
import util from 'util';

class DenunciaService {
  static async criarDenuncia(from, msg, date, provas) {
    let transaction;
  
    try {
      transaction = await sequelize.transaction();
  
      // Cria a denúncia
      const denuncia = await Denuncia.create({ from, msg, date }, { transaction });
  
      // Cria as provas e associa com a denúncia
      for (const provaData of provas) {
        const { fileName, mimeType } = provaData;
  
        // Cria a prova
        const prova = await Prova.create({ fileName, type: mimeType, denunciaID: denuncia.id }, { transaction });
      }
  
      // Confirma a transação
      await transaction.commit();
  
      return denuncia;
    } catch (error) {
      // Desfaz a transação em caso de erro
      if (transaction) {
        await transaction.rollback();
      }
  
      throw new Error('Não foi possível criar a denúncia.');
    }
  }
  

  static async buscarDenunciaPorId(id) {
    try {
      const denuncia = await Denuncia.findByPk(id
        , {
          include: [
            {
              model: Prova,
              as: 'provas',
              attributes: ['id', 'fileName', 'type'],
              },
              ],
              });
      return denuncia;
    } catch (error) {
      throw new Error('Não foi possível buscar a denúncia.');
    }
  }

  static async atualizarDenuncia(id, newData) {
    try {
      const denuncia = await Denuncia.findByPk(id);
      if (!denuncia) {
        throw new Error('Denúncia não encontrada.');
      }

      const updatedDenuncia = await denuncia.update(newData);
      return updatedDenuncia;
    } catch (error) {
      throw new Error('Não foi possível atualizar a denúncia.');
    }
  }

  static async excluirDenuncia(id) {
    try {
      const denuncia = await Denuncia.findByPk(id);
      if (!denuncia) {
        throw new Error('Denúncia não encontrada.');
      }

      await denuncia.destroy();
      return 'Denúncia excluída com sucesso.';
    } catch (error) {
      throw new Error('Não foi possível excluir a denúncia.');
    }
  }

  static async deletarDenuncias() {
    let transaction;
  
    try {
      transaction = await sequelize.transaction();
  
      // Excluir os registros da tabela Prova
      await Prova.destroy({ where: {}, truncate: false, transaction });
  
      // Truncar a tabela Denuncia
      await Denuncia.destroy({ where: {}, truncate: false, cascade: true, transaction });
  
      // Apagar arquivos de prova
      await util.promisify(fs.rmdir)('./provas', { recursive: true });
  
      // Confirmar a transação
      await transaction.commit();
  
      return 'Denúncias excluídas com sucesso.';
    } catch (error) {
      // Desfazer a transação em caso de erro
      if (transaction) {
        await transaction.rollback();
      }
  
      throw new Error(error.message);
    }
  }
  
  
  

  static async listarDenuncias() {
    try {
      const denuncias = await Denuncia.findAll(
        {
          include: [
            {
              model: Prova,
              as: 'provas',
              attributes: ['id', 'fileName', 'type'],
            },
          ],
        }
      );
      return denuncias;
    } catch (error) {
      throw new Error('Não foi possível listar as denúncias.');
    }
  }  
  
}

export default DenunciaService;
