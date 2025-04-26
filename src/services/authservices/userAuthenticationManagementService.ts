import { Service } from "typedi";
import { UserAuthRepoisitory } from "../../repository/auth/userAuthRepository";
import * as bcrypt from "bcryptjs";
import { CreateUserDTO } from "../../dto/userdto/create-user.dto";
import * as jwt from "jsonwebtoken";
import { UserLoginDTO } from "../../dto/userdto/user-login.dto";
import { UserVerifyOtp } from "../../dto/userdto/user-verifyotp.dto";
import { UserResetPasswordMailDto } from "../../dto/userdto/user-reset-password-mail.dto";
import { UserResetPasswordDto } from "../../dto/userdto/user-reset-password.dto";
import { validateCreateUser, validateOtp, validateUserLogin } from '../../middleware/validation/validate-user-schema';
import { EditUserDTO,  } from '../../dto/userdto/edit-user.dto';
import { envConfig } from "../../config";
import { currentDate, uniqueCode } from "../../util/util";
import Bull from "bull";
import { USER_TYPE } from "../../enums/UserType.enum";

export const EmailverificationQueue = new Bull('sendVerificationMail')
export const OnboardingMailQueue = new Bull('OnboardingMail')
export const ForgetPasswordMailQueue = new Bull('forgetPasswordMail')

@Service()
export class UserAuthenticationManagementService {
    constructor(private readonly userAuthRepository: UserAuthRepoisitory) { }

    async createUser(item: CreateUserDTO) {
        const { error } = validateCreateUser(item);
        if (error) throw new Error(error.details[0].message);

        let checkUserExist: any = await this.userAuthRepository.findByEmail(
            item.email
        );

        if (checkUserExist.length > 0) {
            throw new Error("User already exist");
        }
        
        item.password = bcrypt.hashSync(item.password, 10);
        item.email_verify = "pending";
        item.status = "active";
        item.type = USER_TYPE.USER;
        let otp = uniqueCode(8);
        let type = "emailVerify";

        let createUser: any = await this.userAuthRepository.createUser({
            ...item,
            password: item.password,
        });

        if (createUser.affectedRows == 0) {
            throw new Error("User not created");
        }
        let createOtp: any = await this.userAuthRepository.createOtp(
            otp,
            item.email,
            type,
            currentDate()
        );

        if (createOtp.affectedRows == 0) {
            throw new Error("Otp not created");
        }

        //send mail to user

        await EmailverificationQueue.add({ emailAddress: item.email, otp: otp, fullname: item.fullname, subject: 'Email verification' })


    }

    async verifyOtp(item: UserVerifyOtp) {
        const { error } = validateOtp(item);

        if (error) throw new Error(error.details[0].message);
        let type = "emailVerify";

        let checkIfOtpExist: any = await this.userAuthRepository.checkIfOtpExists(
            item.otp,
            type
        );

        if (checkIfOtpExist.length == 0) {
            throw new Error("Invalid OTP");
        }

        let status = "verified";
        let updateUser: any =
            await this.userAuthRepository.updateUserOtpVerificationStatus(
                checkIfOtpExist[0].user_email,
                status
            );

        if (updateUser.affectedRows == 0) {
            throw new Error("User not verified");
        }

        let deleteOtp: any = await this.userAuthRepository.deleteOtp(
            checkIfOtpExist[0].id
        );

        if (deleteOtp.affectedRows == 0) {
            throw new Error("Otp not deleted");
        }

        await OnboardingMailQueue.add({ email: checkIfOtpExist[0].user_email })

    }

    async login(req: UserLoginDTO) {

        const { error } = validateUserLogin(req);
        if (error) throw new Error(error.details[0].message);
        let loginUser: any = await this.userAuthRepository.loginUser(req.email);

        if (loginUser.length === 0) {
            throw new Error("Credentials does not match our records");
        }

        if (loginUser[0].email_verified === 'pending') {
            throw new Error('Account has not been verified. Kindly check your email for the OTP to verify your account')
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
        let secret: any = envConfig.JWT_SECRET;

        let token = jwt.sign(user, secret, { expiresIn: "48h" });

      //  await this.userAuthRepository.createLoggedIn(id)

        return { user: user, jwt: token };
    }

    async resetPasswordMail(item: UserResetPasswordMailDto) {
        let checkUserExist: any = await this.userAuthRepository.findByEmail(
            item.email
        );

        if (checkUserExist.length == 0) {
            throw new Error("User not found");
        }

        let otp = uniqueCode(8);
        let type = "resetPassword";
        let createOtp: any = await this.userAuthRepository.createOtp(
            otp,
            item.email,
            type,
            currentDate()
        );

        if (createOtp.affectedRows == 0) {
            throw new Error("Otp not created");
        }

        await ForgetPasswordMailQueue.add({ email: item.email, token: otp, firstname: checkUserExist[0].firstname, subject: 'Reset Password' })

    }

    async resetPassword(item: UserResetPasswordDto) {
        item.type = "resetPassword";

        let checkIfOtpExist: any = await this.userAuthRepository.checkIfOtpExists(
            item.otp,
            item.password
        );

        if (checkIfOtpExist.length == 0) {
            throw new Error("Invalid OTP");
        }

        let hashedPass = bcrypt.hashSync(item.password, 10);
        let updateUser: any = await this.userAuthRepository.updateUserPassword(
            checkIfOtpExist[0].user_email,
            hashedPass
        );

        if (updateUser.affectedRows == 0) {
            throw new Error("User not updated");
        }

        let deleteOtp: any = await this.userAuthRepository.deleteOtp(
            checkIfOtpExist[0].id
        );

        if (deleteOtp.affectedRows == 0) {
            throw new Error("Otp not deleted");
        }
    }

    async deleteUserProfile(id: number) {
        return await this.userAuthRepository.deleteUserProfile(id)
    }

    async updateUserCredentials(item: EditUserDTO) {
        return await this.userAuthRepository.updateUser(item)
    }



    /**
     * cron job that automatically sends mail of the number of users on the platform
     */
    async getUsersCountandUsersRegisteredInThePast24hours() {
        let result1: any = await this.userAuthRepository.getUsersCount()

        if (result1.length == 0) {
            return
        }

        let result2: any = await this.userAuthRepository.getUsersRegisteredInThePast24hrs()

        if (result2.length == 0) {
            return
        }

        //get the number of verified users and pending users
        const pendingUsers = result1.filter((user: any) => user.email_verified === 'pending');
        const verifiedUsers = result1.filter((user: any) => user.email_verified === 'verified');

        let data = {
            number_of_users_registered: result1.length,
            number_of_users_registered_in_past_24_hours: result2[0].user_count,
            number_of_unverified_users: pendingUsers.length,
            number_of_verified_users: verifiedUsers.length
        }


    }



}
