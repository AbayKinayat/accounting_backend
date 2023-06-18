'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Debt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Debt.belongsTo(models.Users, {
        as: "user",
        foreignKey: "userId"
      })
      Debt.belongsTo(models.DebtStatus, {
        as: "status",
        foreignKey: "statusId"
      })
    }
  }
  Debt.init({
    dateFrom: DataTypes.INTEGER,
    dateTo: DataTypes.INTEGER,
    sum: DataTypes.DECIMAL,
    isDebtor: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    isPaid: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    amountPaid: DataTypes.DECIMAL,
    statusId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Debt',
  });
  return Debt;
};