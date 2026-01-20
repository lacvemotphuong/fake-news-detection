const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const Prediction = require("../models/Prediction");

const router = express.Router();

/**
 * POST /api/predict
 */
router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const scriptPath = path.join(__dirname, "../python/predict.py");
  const python = spawn("python", [scriptPath, text]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (err) => {
    errorOutput += err.toString();
  });

  python.on("close", async () => {
    if (errorOutput) {
      console.error(errorOutput);
      return res.status(500).json({ error: "Python error" });
    }

    try {
      const result = JSON.parse(output);

      const saved = await Prediction.create({
        text,
        result: result.label,
        probability: result.probability,
      });

      res.json({
        id: saved._id,
        ...result,
      });
    } catch (err) {
      res.status(500).json({
        error: "Invalid Python output",
        raw: output,
      });
    }
  });
});

/**
 * GET /api/predict/history
 */
router.get("/history", async (req, res) => {
  try {
    const history = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Cannot get history" });
  }
});

module.exports = router;
