const model = {};

const license = require('./license');
const license_installation = require('./license_installation');
const employee = require('./employee');
const language = require('./language');
const user_login = require('./user_login');
const menu = require('./menu');
const menu_translations = require('./menu_translations');
const authentication = require('./authentication');

model.license = license;
model.license_installation = license_installation;
model.employee = employee;
model.language = language;
model.user_login = user_login;
model.menu = menu;
model.menu_translations = menu_translations;
model.authentication = authentication;

module.exports = model;
