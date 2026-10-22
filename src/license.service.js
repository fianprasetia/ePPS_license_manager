const fs = require("node:fs");
const crypto = require("node:crypto");
const { findLicense } = require("./license.repository");
const { sendSecurityAlert } = require("./mail.service");

const privateKey = fs.readFileSync(
    process.env.LICENSE_PRIVATE_KEY_PATH,
    "utf8"
);

function signResponse(payload) {
    const data = Buffer.from(JSON.stringify(payload));
    const signature = crypto.sign(null, data, privateKey);

    return {
        payload: data.toString("base64"),
        signature: signature.toString("base64"),
    };
}

async function validateLicense({ licenseId, installationId, ip }) {
    const license = findLicense(licenseId);
    let reason = null;

    if (!license) {
        reason = "UNKNOWN_LICENSE";
    } else if (license.status !== "active") {
        reason = "LICENSE_NOT_ACTIVE";
    } else if (Date.now() >= Date.parse(license.expiresAt)) {
        reason = "LICENSE_EXPIRED";
    } else if (!license.installations.includes(installationId)) {
        reason = "UNKNOWN_INSTALLATION";
    }

    if (reason) {
        try {
            await sendSecurityAlert({
                licenseId,
                installationId,
                reason,
                ip,
            });
        } catch (error) {
            console.error("Gagal mengirim alert:", error.message);
        }

        return signResponse({
            valid: false,
            reason,
            licenseId: licenseId || null,
            installationId: installationId || null,
            checkedAt: new Date().toISOString(),
        });
    }

    return signResponse({
        valid: true,
        licenseId,
        installationId,
        expiresAt: license.expiresAt,
        checkedAt: new Date().toISOString(),
    });
}

module.exports = { validateLicense };