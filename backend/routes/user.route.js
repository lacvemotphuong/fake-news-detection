// routes/user.route.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware kiểm tra token
const authMiddleware = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Không có token" });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({ error: "Token không hợp lệ" });

  }

};



// GET PROFILE
// GET /api/user/profile
router.get("/profile", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy user" });
    }

    res.json(user);

  } catch (err) {

    res.status(500).json({ error: "Lỗi server" });

  }

});



// UPDATE PROFILE
// PUT /api/user/profile
router.put("/profile", authMiddleware, async (req, res) => {

  const { username, fullname } = req.body;

  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy user" });
    }

    if (username) {
      user.username = username;
    }

    if (fullname) {
      user.fullname = fullname;
    }

    await user.save();

    res.json({
      message: "Cập nhật thành công",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullname: user.fullname
      }
    });

  } catch (err) {

    res.status(500).json({ error: "Lỗi server" });

  }

});


module.exports = router;