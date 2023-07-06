import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {}

User.init(
    {
        name: DataTypes.STRING,
        userName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        telefone: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: 'users',
        timestamps: false,
    }
);

export default User;