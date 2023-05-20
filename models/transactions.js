'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transactions.belongsTo(models.TransactionTypes, {
        foreignKey: "typeId"
      });
      Transactions.belongsTo(models.Users, {
        foreignKey: "userId"
      })
      Transactions.belongsTo(models.Categories, {
        foreignKey: "categoryId"
      })
    }
  }
  Transactions.init({
    name: DataTypes.STRING,
    amount: DataTypes.NUMBER,
    date: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Transactions',
  });
  return Transactions;
};