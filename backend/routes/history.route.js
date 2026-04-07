// routes/history.route.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Prediction = require("../models/Prediction");

const JWT_SECRET = process.env.JWT_SECRET;


// Middleware auth
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


// GET HISTORY
// GET /api/history
router.get("/", authMiddleware, async (req, res) => {

  try {

    const history = await Prediction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history);

  } catch (err) {

    res.status(500).json({ error: "Lỗi server" });

  }

});


module.exports = router;