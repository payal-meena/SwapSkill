const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs")

const SignupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exisitingUser = await User.findOne({ email })
    if (exisitingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
        const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  loginUser,
  SignupUser
};