"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthController = void 0;
const response_1 = require("../../util/response");
const validate_user_schema_1 = require("../../middleware/validation/validate-user-schema");
const typedi_1 = require("typedi");
const userAuthenticationManagementService_1 = require("../../services/authservices/userAuthenticationManagementService");
let UserAuthController = class UserAuthController {
    constructor(userAuthenticationManagementService) {
        this.userAuthenticationManagementService = userAuthenticationManagementService;
    }
    /**
     *
     * @param {firstname, middlename, lastname, email, password} req
     * @param {200} res
     * @returns  {message}
     * @memberof userController
     * @description create user
     * @throws {Error}
     *
     */
    async register(request, response, next) {
        try {
            let req = request.body;
            let result = await this.userAuthenticationManagementService.createUser({ ...req });
            return (0, response_1.success)(response, 201, result, "Account Created successful!");
        }
        catch (error) {
            console.log(error);
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
    /**
     *
     * @param {otp} req
     * @param {200} res
     * @returns {message}
     * @memberof userController
     * @description verify otp
     * @throws {Error}
     *
     */
    async verifyOtp(request, response, next) {
        try {
            let req = request.body;
            let result = await this.userAuthenticationManagementService.verifyOtp(req);
            return (0, response_1.success)(response, 200, result, "OTP verified successful!");
        }
        catch (error) {
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
    /**
     *
     * @param {email,password} req
     * @param {token , 200} res
     * @returns
     * @memberof userController
     * @description user login
     * @throws {Error}
     */
    async userLogin(request, response, next) {
        try {
            let req = request.body;
            let result = await this.userAuthenticationManagementService.login(req);
            return (0, response_1.success)(response, 200, result, "Login successful!");
        }
        catch (error) {
            console.log(error);
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
    /**
     *
     * @param {email} req
     * @param {200} res
     * @returns {message}
     * @memberof userController
     * @description forgot password
     * @throws {Error}
     * @description send mail to user
     * @returns
     */
    async resetPasswordMail(request, response, next) {
        try {
            const { error } = (0, validate_user_schema_1.validateResetPasswordMail)(request.body);
            if (error)
                throw new Error(error.details[0].message);
            let req = request.body;
            let result = await this.userAuthenticationManagementService.resetPasswordMail(req);
            return (0, response_1.success)(response, 200, result, "Reset password mail sent successful!");
        }
        catch (error) {
            (0, response_1.fail)(response, 400, error.message);
        }
    }
    /**
     *
     * @param {email,password} req
     * @param {*} res
     * @returns {message}
     * @memberof userController
     * @description reset password
     * @throws {Error}
     */
    async resetPassword(request, response, next) {
        try {
            const { error } = (0, validate_user_schema_1.validateResetPassword)(request.body);
            if (error)
                throw new Error(error.details[0].message);
            let req = request.body;
            let result = await this.userAuthenticationManagementService.resetPassword(req);
            return (0, response_1.success)(response, 200, result, "Password reset successful!");
        }
        catch (error) {
            (0, response_1.fail)(response, 400, error.message);
        }
    }
    async deleteUserProfile(request, response, next) {
        try {
            let result = this.userAuthenticationManagementService.deleteUserProfile(request.body.tokenData.id);
            return (0, response_1.success)(response, 200, result, 'User deleted successfully');
        }
        catch (error) {
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
    async updateUserCredentials(request, response, next) {
        try {
            let req = request.body;
            let result = await this.userAuthenticationManagementService.updateUserCredentials({ ...req, userId: request.body.tokenData.id });
            return (0, response_1.success)(response, 200, result, 'user updated successfully');
        }
        catch (error) {
            console.log(error);
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
};
exports.UserAuthController = UserAuthController;
exports.UserAuthController = UserAuthController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [userAuthenticationManagementService_1.UserAuthenticationManagementService])
], UserAuthController);
