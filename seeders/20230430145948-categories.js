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
        iconId: "product",
        color: "#25AA32"
      },
      {
        id: 2,
        name: "Такси",
        typeId: 2,
        iconId: "taxi",
        color: "#D7EA39"
      },
      {
        id: 3,
        name: "Автобус",
        typeId: 2,
        iconId: "autobus",
        color: "#C6EB6B"
      },
      {
        id: 4,
        name: "Запрлата",
        typeId: 2,
        iconId: "salary",
        color: "#70FA70"
      },
      {
        id: 5, 
        name: "Ресторан",
        typeId: 2,
        iconId: "restoran",
        color: "#EB3838"
      },
      {
        id: 6,
        name: "Сладкое",
        typeId: 2,
        iconId: "sweet",
        color: "#DE764D"
      },
      {
        id: 7,
        name: "Аренда жилья",
        typeId: 2,
        iconId: "rental_housing",
        color: "#3DC4C0"
      },
      {
        id: 8,
        name: "Коммунальные услуги",
        typeId: 2,
        iconId: "utilities",
        color: "#31B779"
      },
      {
        id: 9,
        name: "Здоровье",
        typeId: 2,
        iconId: "health",
        color: '#57DF98'
      },
      {
        id: 10,
        name: "Услуги",
        typeId: 2,
        iconId: "services",
        color: "#8A45B6"
      },
      {
        id: 11,
        name: "Подарки(кому-то)",
        typeId: 2,
        iconId: "gifts",
        color: "#3D5AC4"
      },
      {
        id: 12,
        name: "Подарки(мне)",
        typeId: 1,
        iconId: "gifts",
        color: "#6450BD"
      },
      {
        id: 13,
        name: "Долги(кому-то)",
        typeId: 2,
        iconId: "debts",
        color: "#C47C3D"
      },
      {
        id: 14,
        name: "Долги(мне)",
        typeId: 1,
        iconId: "debts",
        color: "#F56AF0"
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
