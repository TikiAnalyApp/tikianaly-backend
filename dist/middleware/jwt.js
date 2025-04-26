"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthorizeToken = void 0;
const jwt = require("jsonwebtoken");
const response_1 = require("../util/response");
const config_1 = require("../config");
const adminAuthorizeToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null)
            throw new Error("Token Not found");
        jwt.verify(token, config_1.envConfig.JWT_SECRET, (err, user) => {
            if (err)
                throw new Error('Token verification' + err);
            req.body.tokenData = user;
            if (user.admin_type !== 'admin') {
                throw new Error('User is not authorized to access this route');
            }
            next();
        });
    }
    catch (error) {
        return (0, response_1.fail)(res, 400, error.message);
    }
};
exports.adminAuthorizeToken = adminAuthorizeToken;
