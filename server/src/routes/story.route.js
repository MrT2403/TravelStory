import express from "express";
import storyController from "../controllers/story.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
import upload from "../services/multer.service.js";

const router = express.Router();

router.post(
  "/add-travel-story",
  authenticateToken,
  storyController.addTravelStory
);

router.get("/get-story", authenticateToken, storyController.getStory);
router.put("/edit-story/:id", authenticateToken, storyController.editStory);
router.delete(
  "/delete-story/:id",
  authenticateToken,
  storyController.deleteStory
);

router.put(
  "/update-favorite/:id",
  authenticateToken,
  storyController.updateFavorite
);

router.get("/search", authenticateToken, storyController.search);

// filter date range
router.get("/filter", authenticateToken, storyController.filterByDate);

router.post(
  "/image-upload",
  upload.single("image"),
  storyController.imageUpload
);

router.delete("/delete-image", storyController.deleteImg);

export default router;
