import express from "express";
import UserController from "../../controller/user/index.js";

const publicUserRouter = express.Router();

publicUserRouter.get("/captchaCode", UserController.CaptchaCode);

export default publicUserRouter;
