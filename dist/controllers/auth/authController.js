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
exports.AdminAuthController = void 0;
const validate_admin_schema_1 = require("../../middleware/validation/validate-admin-schema");
const response_1 = require("../../util/response");
const typedi_1 = require("typedi");
const adminAuthenticationManagementService_1 = require("../../services/authservices/adminAuthenticationManagementService");
let AdminAuthController = class AdminAuthController {
    constructor(adminAuthenticationManagementService) {
        this.adminAuthenticationManagementService = adminAuthenticationManagementService;
    }
    /**
     *
     * @param { firstname, middlename, lastname,  email, username,  admin_type,  password} req
     * @param {200} res
     * @returns {message}
     * @memberof adminController
     * @description create admin
     * @throws {Error}
     *
     */
    async createAdmin(request, response, next) {
        try {
            const { error } = (0, validate_admin_schema_1.validateCreateAdmin)(request.body);
            if (error)
                throw new Error(error.details[0].message);
            let req = request.body;
            let result = await this.adminAuthenticationManagementService.createAdmin(req);
            return (0, response_1.success)(response, 200, result, 'Admin created successful!');
        }
        catch (error) {
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
    /**
     *
     * @param {otp} req
     * @param {200} res
     * @returns {message}
     * @memberof adminController
     * @description admin verify otp
     * @throws {Error}
     */
    async verifyOtp(request, response, next) {
        try {
            const { error } = (0, validate_admin_schema_1.validateAdminOtp)(request.body);
            if (error)
                throw new Error(error.details[0].message);
            let req = request.body;
            let result = await this.adminAuthenticationManagementService.verifyOtp(req);
            return (0, response_1.success)(response, 200, result, 'Admin otp verified successful!');
        }
        catch (error) {
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
    /**
 *
 * @param {email,password} req
 * @param {200} res
 * @returns {message}
 * @memberof adminController
 * @description admin login
 * @throws {Error}
 */
    async login(request, response, next) {
        try {
            const { error } = (0, validate_admin_schema_1.validateAdminLogin)(request.body);
            if (error)
                throw new Error(error.details[0].message);
            let req = request.body;
            let result = await this.adminAuthenticationManagementService.login(req);
            return (0, response_1.success)(response, 200, result, 'Admin login successful!');
        }
        catch (error) {
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
    async resetPassword(request, response, next) {
        try {
            const { error } = (0, validate_admin_schema_1.validateAdminResetPassword)(request.body);
            let req = request.body;
            if (error)
                throw new Error(error.details[0].message);
            let result = await this.adminAuthenticationManagementService.resetPassword(req);
            return (0, response_1.success)(response, 200, result, 'Admin password reset successful!');
        }
        catch (error) {
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
    /**
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async resetPasswordMail(request, response, next) {
        try {
            const { error } = (0, validate_admin_schema_1.validateForgetPasswordMail)(request.body);
            if (error)
                throw new Error(error.details[0].message);
            let req = request.body;
            let result = await this.adminAuthenticationManagementService.resetPasswordMail(req);
            return (0, response_1.success)(response, 200, result, 'mail sent  successful!');
        }
        catch (error) {
            return (0, response_1.fail)(response, 400, error.message);
        }
    }
};
exports.AdminAuthController = AdminAuthController;
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [adminAuthenticationManagementService_1.AdminAuthenticationManagementService])
], AdminAuthController);
