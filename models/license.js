const koneksi = require('../config/database');
const Sequelize = require('sequelize');
const license_installation = require('./license_installation');
const license = koneksi.define(
    'license',
    {
        code_license: {
            type: Sequelize.STRING(100),
            primaryKey: true,
            // field: "license_id",
        },
        client_name: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        max_installations: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        expiresAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);
license.hasMany(license_installation, { foreignKey: 'code_license' });
module.exports = license;
