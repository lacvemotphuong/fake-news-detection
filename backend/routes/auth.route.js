// routes/auth.route.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

// ĐĂNG KÝ
router.post("/register", async (req, res) => {

  const { email, password, username } = req.body;

  console.log("BODY:", req.body);

  if (!email || !password || !username) {
    return res.status(400).json({
      error: "Thiếu thông tin đăng ký"
    });
  }

  try {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email đã tồn tại"
      });
    }

    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    res.status(201).json({
      message: "Đăng ký thành công",
      user
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Lỗi server khi đăng ký"
    });

  }

});

// ĐĂNG NHẬP
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login request:", { email });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email hoặc mật khẩu sai" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email hoặc mật khẩu sai" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login successful for:", user.email);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error("Login error details:", err.stack || err.message);
    res.status(500).json({
      error: "Lỗi server khi đăng nhập",
      details: err.message
    });
  }
});

module.exports = router;