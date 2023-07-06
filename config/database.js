import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

//mysql
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});


sequelize.sync({ alter: true }).then(() => {
    console.log(`Database & tables created!`);
});

export default sequelize;


