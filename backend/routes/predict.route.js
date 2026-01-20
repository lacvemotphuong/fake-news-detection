const express = require("express");
const { spawn } = require("child_process");
const Prediction = require("../models/Prediction");

const router = express.Router();

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const python = spawn("python", ["python/predict.py", text]);

  python.stdout.on("data", async (data) => {
    const result = data.toString().trim();

    const saved = await Prediction.create({
      text,
      result
    });

    res.json({
      result,
      id: saved._id
    });
  });

  python.stderr.on("data", (err) => {
    console.error(err.toString());
    res.status(500).json({ error: "Python error" });
  });
});

module.exports = router;
