"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dbConfig_1 = require("./dbConfig");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
    try {
        req.db = await (0, dbConfig_1.getDbConnection)();
        next();
    }
    catch (error) {
        next(error);
    }
});
app.get("/", (_, res) => {
    res.send("Welcome to the Tikianaly API");
});
app.use("/api/v1/admin", adminRoutes_1.default);
app.use("/api/v1/", userRoutes_1.default);
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: `Tikianaly API says: ${error.message}`,
        },
    });
});
const startServer = async () => {
    try {
        await (0, dbConfig_1.getDbConnection)();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server Running here 👉 http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Server startup failed due to database error:", error);
    }
};
startServer();
exports.default = app;
