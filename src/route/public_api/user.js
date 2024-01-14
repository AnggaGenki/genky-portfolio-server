import express from "express";
import UserController from "../../controller/user/index.js";

const publicUserRouter = express.Router();

publicUserRouter.get("/captchaCode", UserController.CaptchaCode);
publicUserRouter.post("/api/users/register", UserController.Register);

export default publicUserRouter;
