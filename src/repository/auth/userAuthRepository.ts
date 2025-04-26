import { getDbConnection } from "../../dbConfig";
import { v4 as uuidv4 } from "uuid";
import { Service } from "typedi";
import { CreateUserDTO } from "../../dto/userdto/create-user.dto";
import { currentDate } from "../../util/util";
import { EditUserDTO } from '../../dto/userdto/edit-user.dto';



@Service()
export class UserAuthRepoisitory {

    async findByEmail(email: string) {
        const db = await getDbConnection();
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows, fields] = await db.query(sql, [email]);
        db.end();
        return rows;
    }

    async createUser(item: CreateUserDTO) {


        const db = await getDbConnection();
        const sql =
            "INSERT INTO `users`(`uuid`, `fullname`, `phone_number`, `email`, `password`,  `status`,`type`,`email_verify`) VALUES (?,?,?,?,?,?,?,?)";
        let [rows, fields] = await db.query(sql, [
            uuidv4(),
       
            item.fullname,
            item.phone_number,
            item.email,
            item.password,
            item.status,
            item.type,
            item.email_verify,
            item.phone_number,
           
        ]);
        db.end();
        return rows;
    }

    async createOtp(
        otp: string,
        email: string,
        type: string,
        currentDate: string
    ) {
        const db = await getDbConnection();

        const sql =
            "INSERT INTO `otp`( `otp`, `user_email`,`type`) VALUES (?,?,?)";
        let [rows, fields] = await db.query(sql, [otp, email, type, currentDate]);
        db.end();
        return rows;
    }

    async checkIfOtpExists(otp: string, type: string) {
        const db = await getDbConnection();
        const sql = "SELECT * FROM otp WHERE otp = ? AND type = ?";
        const [rows, fields] = await db.query(sql, [otp, type]);
        db.end();
        return rows;
    }

    async updateUserOtpVerificationStatus(email: string, status: string) {
        const db = await getDbConnection();
        const sql = "UPDATE users SET email_verify = ? WHERE email = ?";
        const [rows, fields] = await db.query(sql, [status, email]);
        db.end();
        return rows;
    }

    async deleteOtp(id: string) {
        const db = await getDbConnection();
        const sql = "DELETE FROM otp WHERE id = ?";
        const [rows, fields] = await db.query(sql, [id]);
        db.end();
        return rows;
    }

    async loginUser(email: string) {
        const db = await getDbConnection();
        const sql = "SELECT * FROM users WHERE email = ?  AND deleted_at IS NULL LIMIT 1";
        const [row, fields] = await db.query(sql, [email]);
        db.end();
        return row;
    }

    async updateUserPassword(email: string, password: string) {
        const db = await getDbConnection();
        const sql = "UPDATE users SET password = ? WHERE email = ?";
        const [rows, fields] = await db.query(sql, [password, email]);
        db.end();
        return rows;
    }

    async getUserById(id: any) {
        const db = await getDbConnection()
        const sql = "SELECT id,fullname,email FROM users where id = ?"
        const [row, fields] = await db.query(sql, [id])
        db.end()
        return row
    }


    async deleteUserProfile(id: number) {
        let db = await getDbConnection()
        let sql = "UPDATE users SET deleted_at = ? WHERE id = ?"
        let [row, fields] = await db.query(sql, [currentDate(), id])
        db.end()
        return row

    }

    async updateUser(item: EditUserDTO) {
        let db = await getDbConnection()
        let sql = "UPDATE  users  SET    phone_number =?, fullname=? WHERE id =  ?"
        let [row, fields] = await db.query(sql, [ item.phone_number , item.fullname])
        db.end()
        return row
    }


    async createUserSkill(item: any, userId: any) {
        let db = await getDbConnection()
        let sql = "INSERT INTO `user_skill`(`user_id`, `skill_id`) VALUES (?,?)"
        let [row, fields] = await db.query(sql, [userId, item])
        db.end()
        return row
    }



    async findUserSkillsByUserId(userId: any) {
        let db = await getDbConnection()
        let sql = "SELECT * FROM user_skill WHERE user_id = ?"
        let [row, fields] = await db.query(sql, [userId])
        db.end()
        return row
    }


    async deleteUserSkill(userId: any) {
        let db = await getDbConnection()
        let sql = "DELETE FROM `user_skill` WHERE user_id"
        let [row, fields] = await db.query(sql, [userId])
        db.end()
        return row
    }

    async getUsersCount() {
        let db = await getDbConnection()
        let sql = "SELECT * FROM users"
        let [row, fields] = await db.query(sql)
        db.end()
        return row
    }


    async getUsersRegisteredInThePast24hrs() {
        let db = await getDbConnection()
        let sql = `SELECT COUNT(*) AS user_count
        FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR);
        `
        let [row, fields] = await db.query(sql)
        db.end()
        return row
    }


    async createLoggedIn(id: number) {
        let db = await getDbConnection()
        let sql = 'INSERT INTO `last_login`( `user_id`) VALUES (?)'
        let [row, fields] = await db.query(sql, [id])
        db.end()
        return row
    }


    async getLastTimeLoggedIn(id:number){

    }

 


}
