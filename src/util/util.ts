
require("dotenv").config();
import axios from 'axios';
import { response } from 'express';




export const currentDate = function () {
    let today = new Date()
    let date =
        today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    let time =
        today.getHours() + '-' + today.getMinutes() + ':' + today.getSeconds()
    return date + ' ' + time
}

//return true if char is a number
const isNumber = (text: any) => {
    if (text) {
        var reg = new RegExp('[0-9]+$')
        return reg.test(text)
    }
    return false
}

export const removeSpecial = function (text: string) {
    if (text) {
        let lower = text.toLowerCase()
        let upper = text.toUpperCase()
        let result = ''
        for (var i = 0; i < lower.length; ++i) {
            if (isNumber(text[i]) || lower[i] != upper[i] || lower[i].trim() === '') {
                result += text[i]
            }
        }
        return result
    }
    return ''
}

export const uniqueCode = (length: number) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;

}

export const removeTokenDataFromBody = (req: any) => {

    if (req.tokenData)
        delete req.tokenData;

    return req;
}



// export async function validateEmail(email: string) {
//     try {
//         const { valid, reason } = await validate(email);

//         if (!valid && reason === 'smtp') {
//             console.log("The email validation failed due to a timeout while attempting to verify the SMTP server. However, we'll allow it to pass since it may be a temporary issue.");
//             return true;
//         }

//         if (!valid) {
//             return false
//         }

//         return true;
//     } catch (error: any) {
//         console.log(error.message)
//     }

// }


