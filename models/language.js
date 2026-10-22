const koneksi = require('../config/database');
const Sequelize = require('sequelize');
// const adm_auth = require("./adm_auth");
const language = koneksi.define(
  'language',
  {
    language_code: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);
module.exports = language;
