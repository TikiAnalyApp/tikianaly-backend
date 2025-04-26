import express, { Request, Response, NextFunction, Router } from "express";
import Container from "typedi";
import { AdminAuthController } from "../controllers/auth/authController";


const router: Router = express.Router();


const adminAuthController = Container.get(AdminAuthController);




//admin auth routes
router.post("/createadmin", (req, res, next) =>
    adminAuthController.createAdmin(req, res, next)
);
router.post("/verifyotp", (req, res, next) => adminAuthController.verifyOtp(req, res, next));

router.post("/login", (req, res, next) =>
    adminAuthController.login(req, res, next)
);
router.post("/forgotpassword", (req, res, next) => adminAuthController.resetPasswordMail(req, res, next));
router.post("/resetpassword", (req, res, next) => adminAuthController.resetPassword(req, res, next));




export = router;
