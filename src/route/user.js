import express from "express";
import userController from "../controller/user.js";

const userRouter = express.Router();

userRouter.get("/captchaCode", userController.CaptchaCode);
userRouter.post("/api/users/register", userController.Register);
userRouter.post("/api/users/login", userController.Login);
userRouter.patch("/api/users/update", userController.Update);
userRouter.delete("/api/users/logout", userController.Logout);
userRouter.delete("/api/users/delete", userController.Delete);

export default userRouter;
