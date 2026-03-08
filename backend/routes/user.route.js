// backend/routes/user.route.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Prediction = require("../models/Prediction");

const JWT_SECRET = process.env.JWT_SECRET; 

// Middleware kiểm tra token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Không có token, truy cập bị từ chối" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token không hợp lệ hoặc hết hạn" });
  }
};

// GET /api/user/profile - Lấy thông tin user đang login
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

// PUT /api/user/profile - Cập nhật username hoặc đổi mật khẩu
router.put("/profile", authMiddleware, async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy user" });
    }

    if (username) {
      user.username = username;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Cần mật khẩu hiện tại để đổi" });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Mật khẩu hiện tại sai" });
      }
      user.password = newPassword; // sẽ tự hash nhờ pre-save
    }

    await user.save();

    res.json({
      message: "Cập nhật thành công",
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /api/user/predictions - Lấy lịch sử predict của user
router.get("/predictions", authMiddleware, async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;