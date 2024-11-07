import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5173", "https://travel-story-tau.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/v1", routes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
