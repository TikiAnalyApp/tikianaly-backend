"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const typedi_1 = __importDefault(require("typedi"));
const authController_1 = require("../controllers/auth/authController");
const router = express_1.default.Router();
const adminAuthController = typedi_1.default.get(authController_1.AdminAuthController);
//admin auth routes
router.post("/createadmin", (req, res, next) => adminAuthController.createAdmin(req, res, next));
router.post("/verifyotp", (req, res, next) => adminAuthController.verifyOtp(req, res, next));
router.post("/login", (req, res, next) => adminAuthController.login(req, res, next));
router.post("/forgotpassword", (req, res, next) => adminAuthController.resetPasswordMail(req, res, next));
router.post("/resetpassword", (req, res, next) => adminAuthController.resetPassword(req, res, next));
module.exports = router;
