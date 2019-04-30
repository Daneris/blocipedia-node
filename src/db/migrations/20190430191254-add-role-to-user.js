"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Users",
      "role",
      {
        type: Sequelize.INTEGER,
        allowNull: false,

 // #1
        defaultValue:0
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "role");
  }
};
