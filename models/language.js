const koneksi = require('../config/database');
const Sequelize = require('sequelize');
// const auth = require("./auth");
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
