import { AdminLoginDTO } from "../../dto/admindto/admin-login-dto"
import { AdminResetPasswordMail } from "../../dto/admindto/admin-reset-password-mail.dto"
import { AdminResetPasswordDTO } from "../../dto/admindto/admin-reset-password.dto"
import { AdminVerifyOtp } from "../../dto/admindto/admin-verify-otp"
import { CreateAdminDTO } from "../../dto/admindto/create-admindto"

export interface IAdminAuthManagementServiceInterface {
    createAdmin(item: CreateAdminDTO): Promise<any>
    login(req: AdminLoginDTO): Promise<any>
    verifyOtp(item: AdminVerifyOtp): Promise<any>
    resetPasswordMail(item: AdminResetPasswordMail): Promise<any>
    resetPassword(req: AdminResetPasswordDTO): Promise<any>
}