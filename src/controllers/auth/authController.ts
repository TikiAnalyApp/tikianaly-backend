import { validateCreateAdmin, validateAdminOtp, validateAdminLogin, validateAdminResetPassword, validateForgetPasswordMail } from '../../middleware/validation/validate-admin-schema'
import { success, fail } from '../../util/response'
import { Service } from 'typedi'
import { Request, Response, NextFunction } from 'express'
import { CreateAdminDTO } from '../../dto/admindto/create-admindto'
import { AdminAuthenticationManagementService } from '../../services/authservices/adminAuthenticationManagementService';
import { AdminVerifyOtp } from '../../dto/admindto/admin-verify-otp'
import { AdminLoginDTO } from '../../dto/admindto/admin-login-dto'
import { AdminResetPasswordMail } from '../../dto/admindto/admin-reset-password-mail.dto'


@Service()


export class AdminAuthController {

    constructor(private readonly adminAuthenticationManagementService: AdminAuthenticationManagementService) { }
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


    async createAdmin(request: Request, response: Response, next: NextFunction) {
        try {
            const { error } = validateCreateAdmin(request.body)
            if (error) throw new Error(error.details[0].message)
            let req: CreateAdminDTO = request.body
            let result = await this.adminAuthenticationManagementService.createAdmin(req)
            return success(response, 200, result, 'Admin created successful!')
        } catch (error: any) {
            return fail(response, 400, error.message)
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

    async verifyOtp(request: Request, response: Response, next: NextFunction) {
        try {
            const { error } = validateAdminOtp(request.body)
            if (error) throw new Error(error.details[0].message)
            let req: AdminVerifyOtp = request.body
            let result = await this.adminAuthenticationManagementService.verifyOtp(req)
            return success(response, 200, result, 'Admin otp verified successful!')
        } catch (error: any) {
            return fail(response, 400, error.message)
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

        async login(request: Request, response: Response, next: NextFunction) {
            try {
                const { error } = validateAdminLogin(request.body)
                if (error) throw new Error(error.details[0].message)
                let req: AdminLoginDTO = request.body
                let result = await this.adminAuthenticationManagementService.login(req)
                return success(response, 200, result, 'Admin login successful!')
            } catch (error: any) {
                return fail(response, 400, error.message)
            }
        }

        async resetPassword(request: Request, response: Response, next: NextFunction) {
            try {
                const { error } = validateAdminResetPassword(request.body)
                let req = request.body
                if (error) throw new Error(error.details[0].message)
                let result = await this.adminAuthenticationManagementService.resetPassword(req)
                return success(response, 200, result, 'Admin password reset successful!')
            } catch (error: any) {
                return fail(response, 400, error.message)
            }
        }
        /**
         * 
         * @param {*} req 
         * @param {*} res 
         * @returns 
         */
        async resetPasswordMail(request: Request, response: Response, next: NextFunction) {
            try {
                const { error } = validateForgetPasswordMail(request.body)
                if (error) throw new Error(error.details[0].message)
                let req: AdminResetPasswordMail = request.body
                let result = await this.adminAuthenticationManagementService.resetPasswordMail(req)
                return success(response, 200, result, 'mail sent  successful!')
            } catch (error: any) {
                return fail(response, 400, error.message)
            }
        }
}
