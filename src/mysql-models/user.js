const { DataTypes } = require('sequelize');
import sequelize from '../db/mysql'

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
});

// (async () => {
//   await sequelize.sync({ force: true });
// })()

export default User
