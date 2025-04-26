"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const typedi_1 = __importDefault(require("typedi"));
const userAuthController_1 = require("../controllers/auth/userAuthController");
const app = (0, express_1.default)();
const router = express_1.default.Router();
let userAuthController = typedi_1.default.get(userAuthController_1.UserAuthController);
//auth routes
router.post("/register", (req, res, next) => userAuthController.register(req, res, next));
router.post("/verifyotp", (req, res, next) => userAuthController.verifyOtp(req, res, next));
router.post("/login", (req, res, next) => userAuthController.userLogin(req, res, next));
router.post("/forgotpassword", (req, res, next) => userAuthController.resetPasswordMail(req, res, next));
router.post("/resetpassword", (req, res, next) => userAuthController.resetPassword(req, res, next));
module.exports = router;
