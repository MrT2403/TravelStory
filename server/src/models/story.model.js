import mongoose, { Schema } from "mongoose";

const storySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  visitedLocation: {
    type: [String],
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  visitedDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("TravelStory", storySchema);
