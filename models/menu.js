const koneksi = require("../config/database");
const Sequelize = require("sequelize");
const menu_translations = require("./menu_translations");
const menu = koneksi.define(
  "menu",
  {
    id_menu: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    parent_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    page: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    icon: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    no_ordinal: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

  },
  {
    freezeTableName: true,
  }
);
menu.hasMany(menu_translations, { foreignKey: "id_menu" });
module.exports = menu;
