import { Sequelize } from 'sequelize';

//mysql
const sequelize = new Sequelize('Bot', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
        timestamps: false,
    },
});


sequelize.sync({ alter: true }).then(() => {
    console.log(`Database & tables created!`);
});

export default sequelize;


