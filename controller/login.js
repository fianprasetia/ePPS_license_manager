require('dotenv').config();
const model = require("../models/index");
const koneksi = require("../config/database");
const messages = require("./message");
const logger = require('morgan');
const md5 = require("md5");
const { Op } = require("sequelize");
// const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.selectLogin = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const {
            language_POST: language,
            password_POST: password,
            username_POST: username,
        } = req.body;

        const selectLoginData = await model.user_login.findAll({
            include: [
                {
                    model: model.employee,
                },
            ],
            where: {
                [Op.and]: [
                    { username: username },
                    { password: md5(password) }
                ],
            },
            transaction
        });

        if (selectLoginData.length === 0) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.accessFailed);
        }

        if (selectLoginData[0].status === 0) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.userStatus);
        }

        const change_password = selectLoginData[0].change_password;
        if (change_password == 0) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.resetPassword, username);
        }

        // Query Authentication
        const selectAuthenticationData = await model.authentication.findAll({
            where: {
                username: username
            },
            transaction
        });

        if (selectAuthenticationData.length === 0) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.userAccess);
        }
       
        const arrIdMenu = selectAuthenticationData.map(auth => auth.id_menu);
        const selectMenuData = await model.menu.findAll({
            include: [
                {
                    model: model.menu_translations,
                    attributes: ["translation"],
                    where: {
                        language_code: language
                    },
                }
            ],
            where: {
                id_menu: arrIdMenu,
            },
            transaction,
            order: [
                ['parent_id', 'ASC'],
                ['level', 'ASC'],
                ['no_ordinal', 'ASC'],
            ],
        });

        if (selectMenuData.length === 0) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.userAccess);
        }

        await transaction.commit();

        const responseData = {
            dataLogin: selectLoginData,
            dataMenu: selectMenuData
        };
        return responseHelper.  success(res, messages[language]?.accessSuccess, responseData);

    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan pada server");
    }
};

// 2. UPDATE PASSWORD
// controller.updatePasswordLoginUser = async function (req, res) {
//     const transaction = await koneksi.transaction();
//     try {
//         const language = req.body.language_POST;
//         const username = req.body.username_POST;
//         const password = md5(req.body.password_POST);

//         const selectUserData = await model.user_login.findAll({
//             where: {
//                 username: username
//             },
//             transaction
//         });

//         if (selectUserData.length === 0) {
//             await transaction.rollback();
//             return responseHelper.notFound(res, messages[language]?.userNotFound || 'User not found');
//         }

//         if (selectUserData[0].old_password === password) {
//             await transaction.rollback();
//             return responseHelper.Unsuccessful(res, messages[language]?.passwordSAme);
//         }

//         const updatePasswordData = await model.user_login.update(
//             {
//                 password: password,
//                 change_password: 1
//             },
//             {
//                 where: {
//                     username: username
//                 },
//                 transaction
//             }
//         );

//         if (updatePasswordData[0] > 0) {
//             await transaction.commit();
//             return responseHelper.success(res, messages[language]?.resetPasswordSuccess, updatePasswordData);
//         } else {
//             await transaction.rollback();
//             return responseHelper.Unsuccessful(res, messages[language]?.userAccess);
//         }

//     } catch (error) {
//         await transaction.rollback();
//         return responseHelper.error(res, error, "Terjadi kesalahan pada server saat memperbarui password");
//     }
// };

// // 3. SELECT LOGIN MOBILE (FLAT ASYNC/AWAIT)
// controller.selectLoginMobile = async function (req, res) {
//     const transaction = await koneksi.transaction();
//     try {
//         const username = req.body.username_POST;
//         const password = md5(req.body.password_POST);
//         const language = req.body.language_POST;

//         // Query Login
//         const selectLoginData = await model.user_login.findAll({
//             include: [
//                 {
//                     model: model.company,
//                     attributes: ["name", "code_company_type", "code_company"],
//                 },
//                 {
//                     model: model.hrd_employee,
//                 },
//             ],
//             where: {
//                 username: username,
//                 password: password
//             },
//             transaction
//         });

//         if (selectLoginData.length === 0) {
//             await transaction.rollback();
//             return responseHelper.Unsuccessful(res, messages[language]?.accessFailed);
//         }

//         const user = selectLoginData[0];
//         const statusUser = user.status;
//         const access_mobile = user.access_mobile;
//         const change_password = user.change_password;

//         if (statusUser == 0) {
//             await transaction.rollback();
//             return responseHelper.Unsuccessful(res, messages[language]?.userStatus);
//         }

//         if (change_password == 0) {
//             await transaction.rollback();
//             return responseHelper.Unsuccessful(res, messages[language]?.resetPassword, username);
//         }

//         if (access_mobile == 0) {
//             await transaction.rollback();
//             return responseHelper.Unsuccessful(res, messages[language]?.userStatus);
//         }

//         // Query Authentication Mobile
//         const selectAuthenticationData = await model.authentication_mobile.findAll({
//             where: {
//                 username: username
//             },
//             transaction
//         });

//         if (selectAuthenticationData.length === 0) {
//             await transaction.rollback();
//             return responseHelper.Unsuccessful(res, messages[language]?.userAccess);
//         }

//         // Query Menu Mobile
//         const arrIdMenu = selectAuthenticationData.map(auth => auth.id_menu);
//         const selectMenuData = await model.menu_mobile.findAll({
//             include: [
//                 {
//                     model: model.menu_mobile_translations,
//                     attributes: ["translation"],
//                     where: {
//                         language_code: language
//                     },
//                 }
//             ],
//             where: {
//                 id_menu: arrIdMenu
//             },
//             transaction,
//             order: [
//                 ['level', 'ASC'],
//                 ['no_ordinal', 'ASC'],
//             ],
//         });

//         if (selectMenuData.length === 0) {
//             await transaction.rollback();
//             return responseHelper.Unsuccessful(res, messages[language]?.userAccess);
//         }

//         // Query Company
//         const codeCompany = user.company?.code_company;
//         const selectCompanyData = await model.company.findAll({
//             where: {
//                 code_company: codeCompany
//             },
//             transaction
//         });

//         if (selectCompanyData.length === 0) {
//             await transaction.rollback();
//             return responseHelper.Unsuccessful(res, messages[language]?.userAccess);
//         }

//         // Query Employee Group by Worksite
//         const selectEmployeeByWorksiteData = await model.hrd_employee.findAll({
//             attributes: ["employee_id", "worksite", "fullname", "code_company"],
//             where: {
//                 worksite: {
//                     [Op.like]: user.code_company + "%"
//                 },
//                 date_of_exit: null
//             },
//             transaction
//         });

//         // Query Worksite List
//         const selectWorksiteByCompanyCodeData = await model.company.findAll({
//             attributes: ["code_company", "name", "code_company_type"],
//             where: {
//                 code_company: {
//                     [Op.like]: user.code_company + "%"
//                 }
//             },
//             transaction
//         });

//         await transaction.commit();

//         const responseData = {
//             dataLogin: selectLoginData,
//             dataCompany: selectCompanyData,
//             dataMenu: selectMenuData,
//             dataEmployeeGroup: selectEmployeeByWorksiteData,
//             dataWorksite: selectWorksiteByCompanyCodeData
//         };

//         return responseHelper.success(res, messages[language]?.accessSuccess, responseData);

//     } catch (error) {
//         await transaction.rollback();
//         return responseHelper.error(res, error, "Terjadi kesalahan pada server saat login mobile");
//     }
// };

module.exports = controller;