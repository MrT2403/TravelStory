import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const create = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
      fullname,
      email,
      password: hashedPass,
    });

    await user.save();

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "48h",
      }
    );

    return res.status(201).json({
      error: false,
      user: {
        fullname: user.fullname,
        email: user.email,
      },
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ error: true, message: "Server error" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "48h",
      }
    );

    return res.json({
      error: false,
      message: "Login Successful",
      user: {
        fullname: user.fullname,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getInfo = async (req, res) => {
  try {
    const { userId } = req.user;
    const isUser = await User.findOne({ _id: userId });

    if (!isUser) {
      return res.sendStatus(401);
    }

    return res.json({
      user: isUser,
      message: "",
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};

export default { create, signin, getInfo };
