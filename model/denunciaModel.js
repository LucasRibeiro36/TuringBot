import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Prova from './provaModel.js';

class Denuncia extends Model {}

Denuncia.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    from: DataTypes.STRING,
    msg: DataTypes.STRING,
    date: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'denuncias',
    timestamps: false,
  }
);

Denuncia.hasMany(Prova, { foreignKey: 'denunciaID', as: 'provas' });


export default Denuncia;
