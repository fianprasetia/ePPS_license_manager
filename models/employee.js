const koneksi = require("../config/database");
const Sequelize = require("sequelize");
const employee = koneksi.define(
  "employee",
  {
    employee_id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);
module.exports = employee;
