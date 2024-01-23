import express from "express";
import userController from "../../controller/user/index.js";

const privateUserRouter = express.Router();

privateUserRouter.post("/api/users/register", userController.Register);
privateUserRouter.post("/api/users/login", userController.Login);
privateUserRouter.patch("/api/users/update", userController.Update);

export default privateUserRouter;
