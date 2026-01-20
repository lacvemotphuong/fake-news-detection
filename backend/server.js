const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/fake_news_db")
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.use("/api/predict", require("./routes/predict.route"));
// Route test
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
