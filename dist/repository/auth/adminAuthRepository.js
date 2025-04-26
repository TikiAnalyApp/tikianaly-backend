"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthRepository = void 0;
const dbConfig_1 = require("../../dbConfig");
const uuid_1 = require("uuid");
const typedi_1 = require("typedi");
let AdminAuthRepository = class AdminAuthRepository {
    async findByEmail(email) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = 'SELECT * FROM admin WHERE email = ?';
        const [rows, fields] = await db.query(sql, [email]);
        db.end();
        return rows;
    }
    async createAdmin(item) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = 'INSERT INTO `admin` ( `uuid`,`fullname`, `phone_number`, `email`, `status`,`email_verify`, `admin_type`, `password`) VALUES (?,?,?,?,?,?,?,?)';
        const [rows, fields] = await db.query(sql, [
            (0, uuid_1.v4)(),
            item.fullname,
            item.phone_number,
            item.email,
            item.status,
            item.email_verify,
            item.admin_type,
            item.password,
        ]);
        db.end();
        return rows;
    }
    async createOtp(otp, email, type, currentDate) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = 'INSERT INTO `otp`( `otp`, `user_email`,`type`) VALUES (?,?,?)';
        let [rows, fields] = await db.query(sql, [otp, email, type]);
        db.end();
        return rows;
    }
    async checkIfOtpExists(item) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = 'SELECT * FROM otp WHERE otp = ? AND type = ?';
        const [rows, fields] = await db.query(sql, [item.otp, item.type]);
        db.end();
        return rows;
    }
    async updateAdminOtpVerificationStatus(email, status) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = 'UPDATE admin SET email_verify = ? WHERE email = ?';
        const [rows, fields] = await db.query(sql, [status, email]);
        db.end();
        return rows;
    }
    async deleteOtp(id) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = 'DELETE FROM otp WHERE id = ?';
        const [rows, fields] = await db.query(sql, [id]);
        db.end();
        return rows;
    }
    async login(email) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = 'SELECT * FROM admin WHERE email = ? ';
        const [rows, fields] = await db.query(sql, [email]);
        db.end();
        return rows;
    }
    async updateAdminPassword(email, password) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = 'UPDATE admin SET password = ? WHERE email = ?';
        const [rows, fields] = await db.query(sql, [password, email]);
        db.end();
        return rows;
    }
};
exports.AdminAuthRepository = AdminAuthRepository;
exports.AdminAuthRepository = AdminAuthRepository = __decorate([
    (0, typedi_1.Service)()
], AdminAuthRepository);
