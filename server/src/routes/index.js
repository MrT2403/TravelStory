import express from "express";
import userRoute from "./user.route.js";
import storyRoute from "./story.route.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/", (req, res) => {
  res.send("This is Travel Story API");
});

router.use("/user", userRoute);
router.use("/story", storyRoute);
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));
router.use("/assets", express.static(path.join(__dirname, "../assets")));

export default router;
