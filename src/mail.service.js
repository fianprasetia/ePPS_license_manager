const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendSecurityAlert(data) {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.LICENSE_ADMIN_EMAIL,
        subject: `[LICENSE ALERT] ${data.reason}`,
        text: [
            "Terdeteksi aktivitas lisensi yang perlu diperiksa.",
            "",
            `License ID: ${data.licenseId || "-"}`,
            `Installation ID: ${data.installationId || "-"}`,
            `Reason: ${data.reason}`,
            `IP: ${data.ip || "-"}`,
            `Time: ${new Date().toISOString()}`,
        ].join("\n"),
    });
}

module.exports = { sendSecurityAlert };