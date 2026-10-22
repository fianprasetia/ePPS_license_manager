var koneksi = require("../config/database");
const Sequelize = require("sequelize");
const menu = require("./menu");
const authentication= koneksi.define(
  "authentication",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "user_login",
        key: "username"
      },
      onDelete: "Cascade",
      onUpdate: "Cascade"
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
  },
  {
    freezeTableName: true,
  }
);
authentication.belongsTo(menu, { foreignKey: "id_menu" });
module.exports = authentication;
