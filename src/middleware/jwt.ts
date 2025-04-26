const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import { success, fail } from "../util/response";
import { envConfig } from "../config";

export const adminAuthorizeToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) throw new Error("Token Not found");

        jwt.verify(token, envConfig.JWT_SECRET, (err: any, user: any) => {
            if (err) throw new Error('Token verification' + err);
            req.body.tokenData = user;
            
            if (user.admin_type !== 'admin') {
                throw new Error('User is not authorized to access this route');
            }

            next();
        });
    } catch (error: any) {
        return fail(res, 400, error.message);
    }
}


interface DecodedToken {
    id: string;
}


