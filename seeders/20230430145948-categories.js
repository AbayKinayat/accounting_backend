'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    /**
     * @type {import('../types/ICategory').ICategory[]}
     */
    const data = [
      {
        id: 1,
        name: "Продукты",
        typeId: 2,
        iconId: "product"
      },
      {
        id: 2,
        name: "Такси",
        typeId: 2,
        iconId: "taxi"
      },
      {
        id: 3,
        name: "Автобус",
        typeId: 2,
        iconId: "autobus"
      },
      {
        id: 4,
        name: "Запрлата",
        typeId: 2,
        iconId: "salary"
      },
      {
        id: 5, 
        name: "Ресторан",
        typeId: 2,
        iconId: "restoran"
      },
      {
        id: 6,
        name: "Сладкое",
        typeId: 2,
        iconId: "sweet"
      },
      {
        id: 7,
        name: "Аренда жилья",
        typeId: 2,
        iconId: "rental_housing"
      },
      {
        id: 8,
        name: "Коммунальные услуги",
        typeId: 2,
        iconId: "utilities"
      },
      {
        id: 9,
        name: "Здоровье",
        typeId: 2,
        iconId: "health"
      },
      {
        id: 10,
        name: "Услуги",
        typeId: 2,
        iconId: "services"
      },
      {
        id: 11,
        name: "Подарки(кому-то)",
        typeId: 2,
        iconId: "gifts"
      },
      {
        id: 12,
        name: "Подарки(мне)",
        typeId: 1,
        iconId: "gifts"
      },
      {
        id: 13,
        name: "Долги(кому-то)",
        typeId: 2,
        iconId: "debts"
      },
      {
        id: 14,
        name: "Долги(мне)",
        typeId: 1,
        iconId: "debts"
      }
    ];

    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      item.createdAt = new Date();
      item.updatedAt = new Date();

      const checkData = await queryInterface.rawSelect("Categories", {
        where: {
          id: item.id
        }
      }, ["id"]);

      if (checkData) {
        await queryInterface.bulkUpdate("Categories", item, { id: item.id });
      } else {
        await queryInterface.bulkInsert("Categories", [item], {});
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
