"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateUser = validateCreateUser;
exports.validateUserLogin = validateUserLogin;
exports.validateOtp = validateOtp;
exports.validateResetPasswordMail = validateResetPasswordMail;
exports.validateResetPassword = validateResetPassword;
const Joi = require("joi");
function validateCreateUser(user) {
    const JoiSchema = Joi.object({
        fullname: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
        phone_number: Joi.string().required().min(11).max(15),
        type: Joi.string().valid(user),
    }).options({ abortEarly: false });
    return JoiSchema.validate(user);
}
;
function validateUserLogin(user) {
    const JoiSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
    }).options({ abortEarly: false });
    return JoiSchema.validate(user);
}
;
function validateOtp(otp) {
    const JoiSchema = Joi.object({
        otp: Joi.string().required(),
    }).options({ abortEarly: false });
    return JoiSchema.validate(otp);
}
;
function validateResetPasswordMail(email) {
    const JoiSchema = Joi.object({
        email: Joi.string().required().email(),
    }).options({ abortEarly: false });
    return JoiSchema.validate(email);
}
;
function validateResetPassword(password) {
    const JoiSchema = Joi.object({
        otp: Joi.string().required(),
        password: Joi.string().required().min(5),
    }).options({ abortEarly: false });
    return JoiSchema.validate(password);
}
;
