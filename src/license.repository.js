const licenses = new Map([
    [
        "ePPS-2026-001",
        {
            status: "active",
            expiresAt: "2027-12-31T23:59:59.000Z",
            installations: ["install-client-001"],
        },
    ],
]);

function findLicense(licenseId) {
    return licenses.get(licenseId);
}

module.exports = { findLicense };
// const License = require("../models/license");
// const LicenseInstallation = require("../models/license_installation");
// const employee = require("../models/employee");
// const UserLogin = require("../models/menu_translations");

// async function findLicense(licenseId) {
//     const license = await License.findOne({
//         where: {
//             licenseId,
//         },
//         raw: true,
//     });

//     if (!license) {
//         return null;
//     }

//     const installations = await LicenseInstallation.findAll({
//         where: {
//             licenseId,
//             status: "active",
//         },
//         attributes: ["installationId"],
//         raw: true,
//     });

//     return {
//         status: license.status,
//         expiresAt: license.expiresAt,
//         installations: installations.map(
//             (item) => item.installationId
//         ),
//     };
// }

// module.exports = { findLicense };