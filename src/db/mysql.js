const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql', 'root', '123456', {
  host: '0.0.0.0',
  dialect: 'mysql',
  port: 3306,
  dialectOptions: {
    connectTimeout: 60000 // 增加超时时间，单位为毫秒
  }
})

sequelize.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch((err) => {
  console.error('Unable to connect to the database:', err);
});

export default sequelize
