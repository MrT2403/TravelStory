import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import routes from "./src/routes/index.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api/v1", routes);

mongoose.connect(process.env.MONGO_URI, console.log("Connected to MongoDB"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
