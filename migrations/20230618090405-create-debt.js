'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Debts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateFrom: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dateTo: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sum: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      isDebtor: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: ""
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amountPaid: {
        type: Sequelize.DECIMAL,
        allowBull: false,
        defaultValue: 0
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 // Активный
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Debts');
  }
};