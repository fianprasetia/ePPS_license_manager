const koneksi = require('../config/database');
const Sequelize = require('sequelize');

const license_installation = koneksi.define(
    'license_installation',
    {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        code_license: {
            type: Sequelize.STRING(100),
            references: {
                model: 'license',
                key: 'code_license',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        code_installation: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING(20),
            allowNull: false,
            defaultValue: 'active',
        },
    },
    {
        freezeTableName: true,
    }
);

module.exports = license_installation;