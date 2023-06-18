'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        id: 1,
        name: "Открытый",
      },
      {
        id: 2,
        name: "Закрытый",
      }
    ];

    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      item.createdAt = new Date();
      item.updatedAt = new Date();

      const checkData = await queryInterface.rawSelect("DebtStatuses", {
        where: {
          id: item.id
        }
      }, ["id"]);

      if (checkData) {
        await queryInterface.bulkUpdate("DebtStatuses", item, { id: item.id });
      } else {
        await queryInterface.bulkInsert("DebtStatuses", [item], {});
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DebtStatuses', null, {});
  }
};
