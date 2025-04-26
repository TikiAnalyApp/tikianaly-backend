import { USER_TYPE } from "../../enums/UserType.enum";

export interface CreateUserDTO {
    fullname: string;
    phone_number: number
    email: string;
    password: string;
    email_verify: string;
    status: string;
    type: USER_TYPE.USER;
}

