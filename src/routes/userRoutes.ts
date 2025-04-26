import express, { Application, Router } from "express";
import Container from "typedi";
import { UserAuthController } from '../controllers/auth/userAuthController';

const app: Application = express()

const router: Router = express.Router();


let userAuthController = Container.get(UserAuthController);



//auth routes

router.post("/register", (req, res, next) => userAuthController.register(req, res, next));
router.post("/verifyotp", (req, res, next) => userAuthController.verifyOtp(req, res, next));
router.post("/login", (req, res, next) => userAuthController.userLogin(req, res, next));
router.post("/forgotpassword", (req, res, next) => userAuthController.resetPasswordMail(req, res, next));
router.post("/resetpassword", (req, res, next) => userAuthController.resetPassword(req, res, next));


export = router;
