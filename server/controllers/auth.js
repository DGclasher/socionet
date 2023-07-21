import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password.toString(), salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    let savedUser = await newUser.save();
    savedUser = { ...savedUser.toObject() };
    delete savedUser.password;
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toString() });
    if (!user) return res.status(400).json({ message: "User doesn't exist." });

    const validated = await bcrypt.compare(password, user.password);
    if (!validated)
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const responseData = { ...user.toObject() };
    delete responseData.password;
    res.status(200).json({ token, user: responseData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
