import express from "express";
import userController from "../../controller/user/index.js";

const publicUserRouter = express.Router();

publicUserRouter.get("/captchaCode", userController.CaptchaCode);

export default publicUserRouter;
