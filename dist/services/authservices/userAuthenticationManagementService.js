"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthenticationManagementService = exports.ForgetPasswordMailQueue = exports.OnboardingMailQueue = exports.EmailverificationQueue = void 0;
const typedi_1 = require("typedi");
const userAuthRepository_1 = require("../../repository/auth/userAuthRepository");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const validate_user_schema_1 = require("../../middleware/validation/validate-user-schema");
const config_1 = require("../../config");
const util_1 = require("../../util/util");
const bull_1 = __importDefault(require("bull"));
const UserType_enum_1 = require("../../enums/UserType.enum");
exports.EmailverificationQueue = new bull_1.default('sendVerificationMail');
exports.OnboardingMailQueue = new bull_1.default('OnboardingMail');
exports.ForgetPasswordMailQueue = new bull_1.default('forgetPasswordMail');
let UserAuthenticationManagementService = class UserAuthenticationManagementService {
    constructor(userAuthRepository) {
        this.userAuthRepository = userAuthRepository;
    }
    async createUser(item) {
        const { error } = (0, validate_user_schema_1.validateCreateUser)(item);
        if (error)
            throw new Error(error.details[0].message);
        let checkUserExist = await this.userAuthRepository.findByEmail(item.email);
        if (checkUserExist.length > 0) {
            throw new Error("User already exist");
        }
        item.password = bcrypt.hashSync(item.password, 10);
        item.email_verify = "pending";
        item.status = "active";
        item.type = UserType_enum_1.USER_TYPE.USER;
        let otp = (0, util_1.uniqueCode)(8);
        let type = "emailVerify";
        let createUser = await this.userAuthRepository.createUser({
            ...item,
            password: item.password,
        });
        if (createUser.affectedRows == 0) {
            throw new Error("User not created");
        }
        let createOtp = await this.userAuthRepository.createOtp(otp, item.email, type, (0, util_1.currentDate)());
        if (createOtp.affectedRows == 0) {
            throw new Error("Otp not created");
        }
        //send mail to user
        await exports.EmailverificationQueue.add({ emailAddress: item.email, otp: otp, fullname: item.fullname, subject: 'Email verification' });
    }
    async verifyOtp(item) {
        const { error } = (0, validate_user_schema_1.validateOtp)(item);
        if (error)
            throw new Error(error.details[0].message);
        let type = "emailVerify";
        let checkIfOtpExist = await this.userAuthRepository.checkIfOtpExists(item.otp, type);
        if (checkIfOtpExist.length == 0) {
            throw new Error("Invalid OTP");
        }
        let status = "verified";
        let updateUser = await this.userAuthRepository.updateUserOtpVerificationStatus(checkIfOtpExist[0].user_email, status);
        if (updateUser.affectedRows == 0) {
            throw new Error("User not verified");
        }
        let deleteOtp = await this.userAuthRepository.deleteOtp(checkIfOtpExist[0].id);
        if (deleteOtp.affectedRows == 0) {
            throw new Error("Otp not deleted");
        }
        await exports.OnboardingMailQueue.add({ email: checkIfOtpExist[0].user_email });
    }
    async login(req) {
        const { error } = (0, validate_user_schema_1.validateUserLogin)(req);
        if (error)
            throw new Error(error.details[0].message);
        let loginUser = await this.userAuthRepository.loginUser(req.email);
        if (loginUser.length === 0) {
            throw new Error("Credentials does not match our records");
        }
        if (loginUser[0].email_verified === 'pending') {
            throw new Error('Account has not been verified. Kindly check your email for the OTP to verify your account');
        }
        if (loginUser[0].deleted_at != null) {
            throw new Error("This profile has been deleted");
        }
        let hashedPass = bcrypt.compareSync(req.password, loginUser[0].password);
        if (!hashedPass) {
            throw new Error("Invalid password");
        }
        const { id, firstname, middlename, lastname, email, type, email_verified, profile_image, phone_number, bio, title, location } = loginUser[0];
        const user = { id, firstname, middlename, lastname, email, type, email_verified, profile_image, phone_number, bio, title, location };
        let secret = config_1.envConfig.JWT_SECRET;
        let token = jwt.sign(user, secret, { expiresIn: "48h" });
        //  await this.userAuthRepository.createLoggedIn(id)
        return { user: user, jwt: token };
    }
    async resetPasswordMail(item) {
        let checkUserExist = await this.userAuthRepository.findByEmail(item.email);
        if (checkUserExist.length == 0) {
            throw new Error("User not found");
        }
        let otp = (0, util_1.uniqueCode)(8);
        let type = "resetPassword";
        let createOtp = await this.userAuthRepository.createOtp(otp, item.email, type, (0, util_1.currentDate)());
        if (createOtp.affectedRows == 0) {
            throw new Error("Otp not created");
        }
        await exports.ForgetPasswordMailQueue.add({ email: item.email, token: otp, firstname: checkUserExist[0].firstname, subject: 'Reset Password' });
    }
    async resetPassword(item) {
        item.type = "resetPassword";
        let checkIfOtpExist = await this.userAuthRepository.checkIfOtpExists(item.otp, item.password);
        if (checkIfOtpExist.length == 0) {
            throw new Error("Invalid OTP");
        }
        let hashedPass = bcrypt.hashSync(item.password, 10);
        let updateUser = await this.userAuthRepository.updateUserPassword(checkIfOtpExist[0].user_email, hashedPass);
        if (updateUser.affectedRows == 0) {
            throw new Error("User not updated");
        }
        let deleteOtp = await this.userAuthRepository.deleteOtp(checkIfOtpExist[0].id);
        if (deleteOtp.affectedRows == 0) {
            throw new Error("Otp not deleted");
        }
    }
    async deleteUserProfile(id) {
        return await this.userAuthRepository.deleteUserProfile(id);
    }
    async updateUserCredentials(item) {
        return await this.userAuthRepository.updateUser(item);
    }
    /**
     * cron job that automatically sends mail of the number of users on the platform
     */
    async getUsersCountandUsersRegisteredInThePast24hours() {
        let result1 = await this.userAuthRepository.getUsersCount();
        if (result1.length == 0) {
            return;
        }
        let result2 = await this.userAuthRepository.getUsersRegisteredInThePast24hrs();
        if (result2.length == 0) {
            return;
        }
        //get the number of verified users and pending users
        const pendingUsers = result1.filter((user) => user.email_verified === 'pending');
        const verifiedUsers = result1.filter((user) => user.email_verified === 'verified');
        let data = {
            number_of_users_registered: result1.length,
            number_of_users_registered_in_past_24_hours: result2[0].user_count,
            number_of_unverified_users: pendingUsers.length,
            number_of_verified_users: verifiedUsers.length
        };
    }
};
exports.UserAuthenticationManagementService = UserAuthenticationManagementService;
exports.UserAuthenticationManagementService = UserAuthenticationManagementService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [userAuthRepository_1.UserAuthRepoisitory])
], UserAuthenticationManagementService);
