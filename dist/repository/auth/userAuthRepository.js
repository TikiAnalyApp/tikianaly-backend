"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthRepoisitory = void 0;
const dbConfig_1 = require("../../dbConfig");
const uuid_1 = require("uuid");
const typedi_1 = require("typedi");
const util_1 = require("../../util/util");
let UserAuthRepoisitory = class UserAuthRepoisitory {
    async findByEmail(email) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows, fields] = await db.query(sql, [email]);
        db.end();
        return rows;
    }
    async createUser(item) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = "INSERT INTO `users`(`uuid`, `fullname`, `phone_number`, `email`, `password`,  `status`,`type`,`email_verify`) VALUES (?,?,?,?,?,?,?,?)";
        let [rows, fields] = await db.query(sql, [
            (0, uuid_1.v4)(),
            item.fullname,
            item.phone_number,
            item.email,
            item.password,
            item.status,
            item.type,
            item.email_verify,
            item.phone_number,
        ]);
        db.end();
        return rows;
    }
    async createOtp(otp, email, type, currentDate) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = "INSERT INTO `otp`( `otp`, `user_email`,`type`) VALUES (?,?,?)";
        let [rows, fields] = await db.query(sql, [otp, email, type, currentDate]);
        db.end();
        return rows;
    }
    async checkIfOtpExists(otp, type) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = "SELECT * FROM otp WHERE otp = ? AND type = ?";
        const [rows, fields] = await db.query(sql, [otp, type]);
        db.end();
        return rows;
    }
    async updateUserOtpVerificationStatus(email, status) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = "UPDATE users SET email_verify = ? WHERE email = ?";
        const [rows, fields] = await db.query(sql, [status, email]);
        db.end();
        return rows;
    }
    async deleteOtp(id) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = "DELETE FROM otp WHERE id = ?";
        const [rows, fields] = await db.query(sql, [id]);
        db.end();
        return rows;
    }
    async loginUser(email) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = "SELECT * FROM users WHERE email = ?  AND deleted_at IS NULL LIMIT 1";
        const [row, fields] = await db.query(sql, [email]);
        db.end();
        return row;
    }
    async updateUserPassword(email, password) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = "UPDATE users SET password = ? WHERE email = ?";
        const [rows, fields] = await db.query(sql, [password, email]);
        db.end();
        return rows;
    }
    async getUserById(id) {
        const db = await (0, dbConfig_1.getDbConnection)();
        const sql = "SELECT id,fullname,email FROM users where id = ?";
        const [row, fields] = await db.query(sql, [id]);
        db.end();
        return row;
    }
    async deleteUserProfile(id) {
        let db = await (0, dbConfig_1.getDbConnection)();
        let sql = "UPDATE users SET deleted_at = ? WHERE id = ?";
        let [row, fields] = await db.query(sql, [(0, util_1.currentDate)(), id]);
        db.end();
        return row;
    }
    async updateUser(item) {
        let db = await (0, dbConfig_1.getDbConnection)();
        let sql = "UPDATE  users  SET    phone_number =?, fullname=? WHERE id =  ?";
        let [row, fields] = await db.query(sql, [item.phone_number, item.fullname]);
        db.end();
        return row;
    }
    async createUserSkill(item, userId) {
        let db = await (0, dbConfig_1.getDbConnection)();
        let sql = "INSERT INTO `user_skill`(`user_id`, `skill_id`) VALUES (?,?)";
        let [row, fields] = await db.query(sql, [userId, item]);
        db.end();
        return row;
    }
    async findUserSkillsByUserId(userId) {
        let db = await (0, dbConfig_1.getDbConnection)();
        let sql = "SELECT * FROM user_skill WHERE user_id = ?";
        let [row, fields] = await db.query(sql, [userId]);
        db.end();
        return row;
    }
    async deleteUserSkill(userId) {
        let db = await (0, dbConfig_1.getDbConnection)();
        let sql = "DELETE FROM `user_skill` WHERE user_id";
        let [row, fields] = await db.query(sql, [userId]);
        db.end();
        return row;
    }
    async getUsersCount() {
        let db = await (0, dbConfig_1.getDbConnection)();
        let sql = "SELECT * FROM users";
        let [row, fields] = await db.query(sql);
        db.end();
        return row;
    }
    async getUsersRegisteredInThePast24hrs() {
        let db = await (0, dbConfig_1.getDbConnection)();
        let sql = `SELECT COUNT(*) AS user_count
        FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR);
        `;
        let [row, fields] = await db.query(sql);
        db.end();
        return row;
    }
    async createLoggedIn(id) {
        let db = await (0, dbConfig_1.getDbConnection)();
        let sql = 'INSERT INTO `last_login`( `user_id`) VALUES (?)';
        let [row, fields] = await db.query(sql, [id]);
        db.end();
        return row;
    }
    async getLastTimeLoggedIn(id) {
    }
};
exports.UserAuthRepoisitory = UserAuthRepoisitory;
exports.UserAuthRepoisitory = UserAuthRepoisitory = __decorate([
    (0, typedi_1.Service)()
], UserAuthRepoisitory);
