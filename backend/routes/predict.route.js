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

  // Validate input
  if (!text || text.trim().length < 20) {
    return res.status(400).json({
      error: "Text too short",
    });
  }

  const scriptPath = path.join(__dirname, "../python/predict.py");
  const python = spawn("python", [scriptPath]);

  let output = "";
  let errorOutput = "";

  python.stdin.write(text);
  python.stdin.end();

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", async () => {
    if (errorOutput) {
      console.error(errorOutput);
      return res.status(500).json({ error: "Python error" });
    }

    try {
      const result = JSON.parse(output.trim());

      // Validate python output
      if (
        !result.label ||
        typeof result.fake_probability !== "number" ||
        typeof result.real_probability !== "number"
      ) {
        throw new Error("Invalid model output");
      }

      res.json(result);
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
