import { BaseDTO } from '../BaseDto';
export interface EditUserDTO extends BaseDTO {
   
    fullname: string
    phone_number?: string
    userId: any
   
}

