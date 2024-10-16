import express from "express";
import userController from "../controllers/user.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-account", userController.create);
router.post("/login", userController.signin);
router.get("/get-user", authenticateToken, userController.getInfo);

export default router;
