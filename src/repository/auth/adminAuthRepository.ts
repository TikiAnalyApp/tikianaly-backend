import { getDbConnection } from '../../dbConfig'
import { v4 as uuidv4 } from 'uuid';
import { Service } from 'typedi'
import { CreateAdminDTO } from '../../dto/admindto/create-admindto'


@Service()

export class AdminAuthRepository {
    async findByEmail(email: string) {
        const db = await getDbConnection()
        const sql = 'SELECT * FROM admin WHERE email = ?'
        const [rows, fields] = await db.query(sql, [email])
        db.end()
        return rows
    }

    async createAdmin(item: CreateAdminDTO) {
        const db = await getDbConnection()
        const sql = 'INSERT INTO `admin` ( `uuid`,`fullname`, `phone_number`, `email`, `status`,`email_verify`, `admin_type`, `password`) VALUES (?,?,?,?,?,?,?,?)'
        const [rows, fields] = await db.query(sql, [
            uuidv4(),
            item.fullname,
            item.phone_number,
            item.email,
            item.status,
            item.email_verify,
            item.admin_type,
            item.password,

        ])
        db.end()
        return rows
    }

    async createOtp(otp: string, email: string, type: string, currentDate: string) {
        const db = await getDbConnection()

        const sql =
            'INSERT INTO `otp`( `otp`, `user_email`,`type`) VALUES (?,?,?)'
        let [rows, fields] = await db.query(sql, [otp, email, type])
        db.end()
        return rows
    }

    async checkIfOtpExists(item: any) {
        const db = await getDbConnection()
        const sql = 'SELECT * FROM otp WHERE otp = ? AND type = ?'
        const [rows, fields] = await db.query(sql, [item.otp, item.type])
        db.end()
        return rows
    }

    async updateAdminOtpVerificationStatus(email: string, status: string) {
        const db = await getDbConnection()
        const sql = 'UPDATE admin SET email_verify = ? WHERE email = ?'
        const [rows, fields] = await db.query(sql, [status, email])
        db.end()
        return rows
    }

    async deleteOtp(id: number) {
        const db = await getDbConnection()
        const sql = 'DELETE FROM otp WHERE id = ?'
        const [rows, fields] = await db.query(sql, [id])
        db.end()
        return rows
    }

    async login(email: string) {
        const db = await getDbConnection()
        const sql = 'SELECT * FROM admin WHERE email = ? '
        const [rows, fields] = await db.query(sql, [email])
        db.end()
        return rows
    }


    async updateAdminPassword(email: string, password: string) {
        const db = await getDbConnection()
        const sql = 'UPDATE admin SET password = ? WHERE email = ?'
        const [rows, fields] = await db.query(sql, [password, email])
        db.end()
        return rows
    }



}