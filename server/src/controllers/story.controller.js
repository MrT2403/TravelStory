import TravelStory from "../models/story.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const addTravelStory = async (req, res) => {
  try {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    const parseVisitedDate = new Date(parseInt(visitedDate));
    try {
      const travelStory = new TravelStory({
        title,
        story,
        visitedLocation,
        userId,
        imageUrl,
        visitedDate: parseVisitedDate,
      });

      await travelStory.save();
      res
        .status(201)
        .json({ story: travelStory, message: "Added Successfully" });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error.message,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getStory = async (req, res) => {
  try {
    const { userId } = req.user;
    const travelStory = await TravelStory.find({ userId: userId }).sort({
      isFavorite: -1,
    });
    res.status(200).json({ stories: travelStory });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const imageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No image upload",
      });
    }

    const imageUrl = `http://localhost:5000/api/v1/uploads/${req.file.filename}`;

    res.status(201).json({ imageUrl });
    console.log(imageUrl);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const deleteImg = async (req, res) => {
  const { imageUrl } = req.query;
  if (!imageUrl) {
    return res.status(400).json({
      error: true,
      message: "imageUrl parameter is required",
    });
  }

  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "../uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(200).json({ message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const editStory = async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const parseVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(400)
        .json({ error: true, message: "Travel story not found" });
    }

    const placeholderImgUrl = `http://localhost:5000/assets/cr7.jpg`;

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImgUrl;
    travelStory.visitedDate = parseVisitedDate;

    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update Successful" });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const deleteStory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res.status(404).json({
        error: true,
        message: "Travel story not found",
      });
    }

    await TravelStory.deleteOne({ _id: id, userId: userId });

    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete image file", err);
      }
    });

    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { isFavorite } = req.body;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res
        .status(400)
        .json({ error: true, message: "Travel story not found" });
    }

    travelStory.isFavorite = isFavorite;

    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const search = async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    return res
      .status(404)
      .json({ error: true, message: "Please type in the box" });
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavorite: -1 });

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const filterByDate = async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    const filteredStory = await TravelStory.find({
      userId: userId,
      visitedDate: {
        $gte: start,
        $lte: end,
      },
    }).sort({ isFavorite: -1 });
    res.status(200).json({ stories: filteredStory });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export default {
  addTravelStory,
  getStory,
  imageUpload,
  deleteImg,
  editStory,
  deleteStory,
  updateFavorite,
  search,
  filterByDate,
};
