import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';


class Prova extends Model {}

Prova.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fileName: DataTypes.TEXT,
    type: DataTypes.STRING,
    denunciaID: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'provas',
    timestamps: false,
  }
);



export default Prova;
