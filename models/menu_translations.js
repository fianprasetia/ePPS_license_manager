const koneksi = require("../config/database");
const Sequelize = require("sequelize");
const menu_translations = koneksi.define(
  "menu_translations",
  {
    id_menu_translations: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_menu: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "menu",
        key: "id_menu"
      },
      onDelete: "Cascade",
      onUpdate: "Cascade"
    },
    language_code: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "language",
        key: "language_code"
      },
      onDelete: "Cascade",
      onUpdate: "Cascade"
    },
    translation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    koneksi,
    modelName: 'menu_translations',
    indexes: [
      {
        unique: true,
        fields: ['id_menu', 'language_code'],
      },
    ],
  }
);
module.exports = menu_translations;
