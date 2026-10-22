var koneksi = require("../config/database");
const Sequelize = require("sequelize");
const employee = require("./employee");
const user_login = koneksi.define(
    "user_login",
    {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        employee_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: "employee",
                key: "employee_id"
            },
            onDelete: "Cascade",
            onUpdate: "Cascade"
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        old_password: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        change_password: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);
user_login.belongsTo(employee, { foreignKey: "employee_id" });
module.exports = user_login;
