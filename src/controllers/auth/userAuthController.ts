import { Request, Response, NextFunction, response } from 'express';
import { success, fail } from "../../util/response";
import { validateCreateUser, validateUserLogin, validateOtp, validateResetPasswordMail, validateResetPassword } from "../../middleware/validation/validate-user-schema";
import { CreateUserDTO } from "../../dto/userdto/create-user.dto";
import { Service } from "typedi";
import { UserVerifyOtp } from "../../dto/userdto/user-verifyotp.dto";
import { UserLoginDTO } from "../../dto/userdto/user-login.dto";
import { UserAuthenticationManagementService } from "../../services/authservices/userAuthenticationManagementService";
import { EditUserDTO } from '../../dto/userdto/edit-user.dto';

@Service()
export class UserAuthController {
    constructor(
        private readonly userAuthenticationManagementService: UserAuthenticationManagementService
    ) { }
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
    public async register(request: Request, response: Response, next: NextFunction) {
        try {

            let req: CreateUserDTO = request.body;
            let result = await this.userAuthenticationManagementService.createUser({ ...req });
            return success(response, 201, result, "Account Created successful!");
        } catch (error: any) {
            console.log(error)
            return fail(response, 400, error.message);
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

    public async verifyOtp(request: Request, response: Response, next: NextFunction) {
        try {

            let req: UserVerifyOtp = request.body;
            let result = await this.userAuthenticationManagementService.verifyOtp(
                req
            );

            return success(response, 200, result, "OTP verified successful!");
        } catch (error: any) {
            return fail(response, 400, error.message);
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

    public async userLogin(request: Request, response: Response, next: NextFunction) {
        try {
            let req: UserLoginDTO = request.body;
            let result = await this.userAuthenticationManagementService.login(req);
            return success(response, 200, result, "Login successful!");
        } catch (error: any) {
            console.log(error)
            return fail(response, 400, error.message);
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
    public async resetPasswordMail(request: Request, response: Response, next: NextFunction) {
        try {
            const { error } = validateResetPasswordMail(request.body);
            if (error) throw new Error(error.details[0].message);
            let req = request.body;
            let result =
                await this.userAuthenticationManagementService.resetPasswordMail(req);
            return success(
                response,
                200,
                result,
                "Reset password mail sent successful!"
            );
        } catch (error: any) {
            fail(response, 400, error.message);
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
    public async resetPassword(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            const { error } = validateResetPassword(request.body);
            if (error) throw new Error(error.details[0].message);
            let req = request.body;
            let result = await this.userAuthenticationManagementService.resetPassword(
                req
            );
            return success(response, 200, result, "Password reset successful!");
        } catch (error: any) {
            fail(response, 400, error.message);
        }
    }

    async deleteUserProfile(request: Request, response: Response, next: NextFunction) {
        try {
            let result = this.userAuthenticationManagementService.deleteUserProfile(request.body.tokenData.id)
            return success(response, 200, result, 'User deleted successfully')
        } catch (error: any) {
            return fail(response, 400, error.message)
        }
    }

    async updateUserCredentials(request: Request, response: Response, next: NextFunction) {
        try {
            let req: EditUserDTO = request.body;
            let result = await this.userAuthenticationManagementService.updateUserCredentials({ ...req, userId: request.body.tokenData.id })
            return success(response, 200, result, 'user updated successfully')
        } catch (error: any) {
            console.log(error)

            return fail(response, 400, error.message)
        }
    }




}
