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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthenticationManagementService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const typedi_1 = require("typedi");
const jwt = __importStar(require("jsonwebtoken"));
const adminAuthRepository_1 = require("../../repository/auth/adminAuthRepository");
const config_1 = require("../../config");
const util_1 = require("./../../util/util");
let AdminAuthenticationManagementService = class AdminAuthenticationManagementService {
    constructor(adminAuthRepoistory) {
        this.adminAuthRepoistory = adminAuthRepoistory;
    }
    async createAdmin(item) {
        let adminExist = await this.adminAuthRepoistory.findByEmail(item.email);
        if (adminExist.length > 0) {
            throw new Error("Admin already exists");
        }
        item.password = bcrypt.hashSync(item.password, 10);
        item.status = "active";
        item.email_verify = "pending";
        item.type = "emailVerify";
        let otp = (0, util_1.uniqueCode)(8);
        let result = await this.adminAuthRepoistory.createAdmin({ ...item });
        if (result.affectedRows == 0) {
            throw new Error("Admin creation failed");
        }
        let otpResult = await this.adminAuthRepoistory.createOtp(otp, item.email, item.type, (0, util_1.currentDate)());
        if (otpResult.affectedRows == 0) {
            throw new Error("Otp creation failed");
        }
    }
    async verifyOtp(item) {
        item.type = "emailVerify";
        let checkIfOtpExist = await this.adminAuthRepoistory.checkIfOtpExists({
            ...item,
        });
        if (checkIfOtpExist.length == 0) {
            throw new Error("Invalid OTP");
        }
        let status = "verified";
        let updateAdmin = await this.adminAuthRepoistory.updateAdminOtpVerificationStatus(checkIfOtpExist[0].user_email, status);
        if (updateAdmin.affectedRows == 0) {
            throw new Error("Admin not verified");
        }
        let deleteOtp = await this.adminAuthRepoistory.deleteOtp(checkIfOtpExist[0].id);
        if (deleteOtp.affectedRows == 0) {
            throw new Error("Otp not deleted");
        }
    }
    async login(req) {
        let loginAdmin = await this.adminAuthRepoistory.login(req.email);
        if (loginAdmin.length == 0) {
            throw new Error("User not found");
        }
        let hashedPass = bcrypt.compareSync(req.password, loginAdmin[0].password);
        if (!hashedPass) {
            throw new Error("Invalid password");
        }
        let user = {
            id: loginAdmin[0].id,
            email: loginAdmin[0].email,
            admin_type: loginAdmin[0].admin_type
        };
        let secret = config_1.envConfig.JWT_SECRET;
        let token = jwt.sign(user, secret, { expiresIn: "1h" });
        return token;
    }
    async resetPasswordMail(item) {
        let adminExist = await this.adminAuthRepoistory.findByEmail(item.email);
        if (adminExist.length == 0) {
            throw new Error("Admin not found");
        }
        let otp = (0, util_1.uniqueCode)(8);
        let type = "resetPassword";
        let otpResult = await this.adminAuthRepoistory.createOtp(otp, item.email, type, (0, util_1.currentDate)());
        if (otpResult.affectedRows == 0) {
            throw new Error("Otp creation failed");
        }
        //   sendmail(item.email, otp, "reset password");
    }
    async resetPassword(req) {
        req.type = "resetPassword";
        let checkIfOtpExist = await this.adminAuthRepoistory.checkIfOtpExists(req);
        if (checkIfOtpExist.length == 0) {
            throw new Error("Invalid OTP");
        }
        req.password = bcrypt.hashSync(req.password, 10);
        let updateAdmin = await this.adminAuthRepoistory.updateAdminPassword(checkIfOtpExist[0].user_email, req.password);
        if (updateAdmin.affectedRows == 0) {
            throw new Error("Password not updated");
        }
        let deleteOtp = await this.adminAuthRepoistory.deleteOtp(checkIfOtpExist[0].id);
        if (deleteOtp.affectedRows == 0) {
            throw new Error("Otp not deleted");
        }
    }
};
exports.AdminAuthenticationManagementService = AdminAuthenticationManagementService;
exports.AdminAuthenticationManagementService = AdminAuthenticationManagementService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [adminAuthRepository_1.AdminAuthRepository])
], AdminAuthenticationManagementService);
