import { string } from 'joi';
const Joi = require("joi");

export function validateCreateUser(user: any) {
    const JoiSchema = Joi.object({
      
        fullname: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
        phone_number: Joi.string().required().min(11).max(15),
        type: Joi.string().valid(user),
    }).options({ abortEarly: false });

    return JoiSchema.validate(user);
};

export function validateUserLogin(user: any) {
    const JoiSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
    }).options({ abortEarly: false });

    return JoiSchema.validate(user);
};

export function validateOtp(otp: any) {
    const JoiSchema = Joi.object({
        otp: Joi.string().required(),
    }).options({ abortEarly: false });

    return JoiSchema.validate(otp);
};

export function validateResetPasswordMail(email: any) {
    const JoiSchema = Joi.object({
        email: Joi.string().required().email(),
    }).options({ abortEarly: false });

    return JoiSchema.validate(email);
};

export function validateResetPassword(password: any) {
    const JoiSchema = Joi.object({
        otp: Joi.string().required(),
        password: Joi.string().required().min(5),
    }).options({ abortEarly: false });

    return JoiSchema.validate(password);
};
