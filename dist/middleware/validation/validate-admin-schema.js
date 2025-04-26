"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateAdmin = validateCreateAdmin;
exports.validateAdminOtp = validateAdminOtp;
exports.validateAdminLogin = validateAdminLogin;
exports.validateForgetPasswordMail = validateForgetPasswordMail;
exports.validateAdminResetPassword = validateAdminResetPassword;
const Joi = require("joi");
function validateCreateAdmin(admin) {
    const JoiSchema = Joi.object({
        fullname: Joi.string().required(),
        phone_number: Joi.string().required().min(11).max(15),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
    }).options({ abortEarly: false });
    return JoiSchema.validate(admin);
}
;
function validateAdminOtp(otp) {
    const JoiSchema = Joi.object({
        otp: Joi.string().required(),
    }).options({ abortEarly: false });
    return JoiSchema.validate(otp);
}
;
function validateAdminLogin(admin) {
    const JoiSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
    }).options({ abortEarly: false });
    return JoiSchema.validate(admin);
}
;
function validateForgetPasswordMail(email) {
    const JoiSchema = Joi.object({
        email: Joi.string().required(),
    }).options({ abortEarly: false });
    return JoiSchema.validate(email);
}
;
function validateAdminResetPassword(data) {
    const JoiSchema = Joi.object({
        email: Joi.string().required().email(),
        otp: Joi.string().required(), // Add OTP field
        password: Joi.string().required().min(5),
        type: Joi.string().required() // Add type field
    }).options({ abortEarly: false });
    return JoiSchema.validate(data);
}
;
