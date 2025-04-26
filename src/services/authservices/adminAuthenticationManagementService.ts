import * as bcrypt from "bcryptjs";
import { Service } from "typedi";
import * as jwt from "jsonwebtoken";
import { CreateAdminDTO } from "../../dto/admindto/create-admindto";
import { AdminLoginDTO } from "../../dto/admindto/admin-login-dto";
import { AdminVerifyOtp } from "../../dto/admindto/admin-verify-otp";
import { AdminAuthRepository } from "../../repository/auth/adminAuthRepository";
import { IAdminAuthManagementServiceInterface } from "../interface/IAdminAuthManagementServieInterface";
import { getDbConnection } from "../../dbConfig";
import { envConfig } from "../../config";
import { currentDate, uniqueCode } from './../../util/util';
import { AdminResetPasswordMail } from "../../dto/admindto/admin-reset-password-mail.dto";
import { AdminResetPasswordDTO } from "../../dto/admindto/admin-reset-password.dto";

interface User {
    id?: number
    fullname?: string
    phone_number?: number
    email?: string
    admin_type?: string
}
@Service()
export class AdminAuthenticationManagementService
    implements IAdminAuthManagementServiceInterface {
    constructor(private readonly adminAuthRepoistory: AdminAuthRepository) { }

    async createAdmin(item: CreateAdminDTO) {


        let adminExist: any = await this.adminAuthRepoistory.findByEmail(
            item.email
        );

        if (adminExist.length > 0) {
            throw new Error("Admin already exists");
        }
      
        item.password = bcrypt.hashSync(item.password, 10);
        item.status = "active";
        item.email_verify = "pending";
        item.type = "emailVerify";
        let otp = uniqueCode(8);

        let result: any = await this.adminAuthRepoistory.createAdmin({ ...item });

        if (result.affectedRows == 0) {
            throw new Error("Admin creation failed");
        }
        let otpResult: any = await this.adminAuthRepoistory.createOtp(
            otp,
            item.email,
            item.type,
            currentDate()
        );
        if (otpResult.affectedRows == 0) {
            throw new Error("Otp creation failed");
        }
      

    }
    async verifyOtp(item: AdminVerifyOtp) {
        item.type = "emailVerify";
        let checkIfOtpExist: any = await this.adminAuthRepoistory.checkIfOtpExists({
            ...item,
        });
        if (checkIfOtpExist.length == 0) {
            throw new Error("Invalid OTP");
        }

        let status = "verified";

        let updateAdmin: any =
            await this.adminAuthRepoistory.updateAdminOtpVerificationStatus(
                checkIfOtpExist[0].user_email,
                status
            );
        if (updateAdmin.affectedRows == 0) {
            throw new Error("Admin not verified");
        }
        let deleteOtp: any = await this.adminAuthRepoistory.deleteOtp(
            checkIfOtpExist[0].id
        );

        if (deleteOtp.affectedRows == 0) {
            throw new Error("Otp not deleted");
        }
    }

    async login(req: AdminLoginDTO) {
        let loginAdmin: any = await this.adminAuthRepoistory.login(req.email);
        if (loginAdmin.length == 0) {
            throw new Error("User not found");
        }
        let hashedPass = bcrypt.compareSync(req.password, loginAdmin[0].password);

        if (!hashedPass) {
            throw new Error("Invalid password");
        }

        let user: User = {
            id: loginAdmin[0].id,
            email: loginAdmin[0].email,
            admin_type: loginAdmin[0].admin_type
        };

        let secret: any = envConfig.JWT_SECRET;

        let token = jwt.sign(user, secret, { expiresIn: "1h" });
       
        return token;
    }

    async resetPasswordMail(item: AdminResetPasswordMail) {
        let adminExist: any = await this.adminAuthRepoistory.findByEmail(
            item.email
        );
        if (adminExist.length == 0) {
            throw new Error("Admin not found");
        }
        let otp = uniqueCode(8);
        let type = "resetPassword";
        let otpResult: any = await this.adminAuthRepoistory.createOtp(
            otp,
            item.email,
            type,
            currentDate()
        );
        if (otpResult.affectedRows == 0) {
            throw new Error("Otp creation failed");
        }
        //   sendmail(item.email, otp, "reset password");
    }

    async resetPassword(req: AdminResetPasswordDTO) {
        req.type = "resetPassword";

        let checkIfOtpExist: any = await this.adminAuthRepoistory.checkIfOtpExists(
            req
        );
        if (checkIfOtpExist.length == 0) {
            throw new Error("Invalid OTP");
        }
        req.password = bcrypt.hashSync(req.password, 10);

        let updateAdmin: any = await this.adminAuthRepoistory.updateAdminPassword(
            checkIfOtpExist[0].user_email,
            req.password
        );
        if (updateAdmin.affectedRows == 0) {
            throw new Error("Password not updated");
        }

        let deleteOtp: any = await this.adminAuthRepoistory.deleteOtp(
            checkIfOtpExist[0].id
        );
        if (deleteOtp.affectedRows == 0) {
            throw new Error("Otp not deleted");
        }
    }
}
