// server.js
require('dotenv').config(); // phải ở đầu file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // nếu sau này cần serve static files

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Thoát nếu không connect được DB (tùy chọn)
  });

// Routes
app.use("/api/predict", require("./routes/predict.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/history", require("./routes/history.route"));


// Chỉ mount /api/user nếu file tồn tại (tránh lỗi khi chưa có)
try {
  const userRoute = require("./routes/user.route");
  app.use("/api/user", userRoute);
  console.log("User routes loaded successfully");
} catch (err) {
  console.warn("User routes not found or error:", err.message);
  // Không crash server, chỉ cảnh báo
}

// Route test
app.get("/", (req, res) => {
  res.send("Backend Fake News Detection is running 🚀");
});

// Xử lý route không tồn tại (404)
app.use((req, res) => {
  res.status(404).json({ error: "Không tìm thấy route" });
});

// Xử lý lỗi server (500)
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: "Có lỗi xảy ra từ server" });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});