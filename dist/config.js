"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.envConfig = exports.dbConfig = void 0;
require('dotenv').config();
exports.dbConfig = {
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};
exports.envConfig = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
    JWT_SECRET: process.env.JWT_SECRET,
    PERCENTAGE_CHARGE: process.env.PERCENTAGE_CHARGE ? parseFloat(process.env.PERCENTAGE_CHARGE) : undefined,
    WIN_PATH: process.env.WIN_PATH,
    UNIX_PATH: process.env.UNIX_PATH,
};
exports.config = {};
