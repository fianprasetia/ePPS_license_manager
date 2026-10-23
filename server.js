
require("dotenv").config();

const express = require("express");
const http = require('http');
const path = require('path');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const createError = require('http-errors');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { validateLicense } = require("./src/license.service");
const app = express();

app.use(
    helmet({
        contentSecurityPolicy: false, // Set false to allow EJS inline assets & styles
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        originAgentCluster: false,
        crossOriginResourcePolicy: false,
        hsts: false, // Disable Strict-Transport-Security to prevent forcing HTTPS
    })
);

app.use(cors());

// =====================================================
// SECURITY
// =====================================================

app.use(express.json({
    limit: "10kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: '100mb'
}));
// =====================================================
// HEALTH CHECK
// =====================================================

// Untuk memeriksa apakah License Server aktif.
// Endpoint ini tidak memeriksa status lisensi.
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "license-server"
    });
});

// =====================================================
// RATE LIMITER
// =====================================================

const licenseRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "RATE_LIMIT_EXCEEDED",
        message: "Terlalu banyak permintaan validasi lisensi."
    }
});

app.use("/api/license", licenseRateLimit);


app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('pages/index');
});
app.get("/login", function (req, res) {
    res.render("pages/login");
});
app.get("/menu_directory", function (req, res) {
    res.render("pages/menu_directory");
});
app.get("/language", function (req, res) {
    res.render("pages/language");
});
// =====================================================
// VALIDATE LICENSE
// =====================================================

app.post("/api/license/validate", async (req, res) => {
    const { licenseId, installationId } = req.body || {};

    // Validasi input
    if (
        typeof licenseId !== "string" ||
        typeof installationId !== "string" ||
        !/^[A-Za-z0-9_-]{1,100}$/.test(licenseId) ||
        !/^[A-Za-z0-9_-]{1,100}$/.test(installationId)
    ) {
        return res.status(400).json({
            error: "INVALID_REQUEST",
            message: "License ID atau installation ID tidak valid."
        });
    }

    try {
        const result = await validateLicense({
            licenseId,
            installationId,
            ip: req.ip
        });

        // Hasil validasi dikembalikan sesuai format service.
        return res.status(200).json(result);
    } catch (error) {
        // Detail error hanya dicatat di log server.
        console.error(
            "License validation error:",
            error.message
        );

        return res.status(500).json({
            error: "LICENSE_SERVICE_ERROR",
            message: "Terjadi kesalahan pada layanan validasi lisensi."
        });
    }
});

/* =========================================
   API ROUTES
========================================= */
const routes = [
    ['/', require('./routes/index')],
    ['/login', require('./routes/login')],
    ['/menu', require('./routes/menu')],
    ['/language', require('./routes/language')],
    ['/translate', require('./routes/translate')],
    // ['/users', require('./routes/users')],
    // ['/employee', require('./routes/employee')],
    // ['/millactivation', require('./routes/mill_activation')],
    // ['/company', require('./routes/company')],
    // ['/vehiclenumber', require('./routes/vehicle_number')],
    // ['/weightbridge', require('./routes/weight_bridge')],
    // ['/printticket', require('./routes/print_ticket')],
    // ['/download-test-file.bin', require('./routes/download')],
];
routes.forEach(([routePath, ...middleware]) => {
    app.use(routePath, ...middleware);
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res, next) => {
    next(createError(404));
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "INVALID_JSON",
            message: "Format JSON tidak valid."
        });
    }

    console.error("Unhandled server error:", err.message);

    return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server."
    });
});

// =====================================================
// START SERVER
// =====================================================

const PORT = Number(process.env.PORT) || 4000;
const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`License Server running on port ${PORT}`);
});

server.on("error", (error) => {
    console.error("Failed to start License Server:", error);
    process.exitCode = 1;
});
