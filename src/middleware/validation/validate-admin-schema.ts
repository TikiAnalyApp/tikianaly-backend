const Joi = require("joi");

export function validateCreateAdmin(admin: any) {
    const JoiSchema = Joi.object({

        fullname: Joi.string().required(),
        phone_number: Joi.string().required().min(11).max(15),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
    }).options({ abortEarly: false });

    return JoiSchema.validate(admin);
};

export function validateAdminOtp(otp: any) {
    const JoiSchema = Joi.object({
        otp: Joi.string().required(),
    }).options({ abortEarly: false });

    return JoiSchema.validate(otp);
};

export function validateAdminLogin(admin: any) {
    const JoiSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5),
    }).options({ abortEarly: false });

    return JoiSchema.validate(admin);
};



export function validateForgetPasswordMail(email: any) {
    const JoiSchema = Joi.object({
        email: Joi.string().required(),
    }).options({ abortEarly: false });

    return JoiSchema.validate(email);
};

export function validateAdminResetPassword(data: any) {
    const JoiSchema = Joi.object({
        email: Joi.string().required().email(),
        otp: Joi.string().required(), // Add OTP field
        password: Joi.string().required().min(5),
        type: Joi.string().required() // Add type field
    }).options({ abortEarly: false });

    return JoiSchema.validate(data);
};