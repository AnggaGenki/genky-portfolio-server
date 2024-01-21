import express from "express";
import userController from "../../controller/user/index.js";

const privateUserRouter = express.Router();

privateUserRouter.post("/api/users/register", userController.Register);
privateUserRouter.post("/api/users/login", userController.Login);

export default privateUserRouter;
