import { Router } from "express";
import * as userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/", userController.createUser);
userRouter.get("/", userController.listUsers);
userRouter.get("/:id", userController.getUser);
userRouter.put("/", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
