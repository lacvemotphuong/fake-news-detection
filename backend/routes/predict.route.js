const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const Prediction = require("../models/Prediction");  

const router = express.Router();

// POST /predict - Nhận text + model_type, gọi Python, lưu history, trả kết quả
router.post("/", async (req, res) => {
  const { text, model_type = "both" } = req.body;  // model_type: 'tfidf', 'phobert', 'both'

  // Validate input
  if (!text || typeof text !== "string" || text.trim().length < 20) {
    return res.status(400).json({
      error: "Text quá ngắn (tối thiểu 20 ký tự)",
    });
  }

  // Đường dẫn đến predict.py (điều chỉnh nếu thư mục khác)
  const scriptPath = path.join(__dirname, "../python/predict.py");

  // Gọi Python với argument: text + model_type
  const python = spawn("python", [scriptPath, text, model_type]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", async (code) => {
    if (code !== 0) {
      console.error("Python error:", errorOutput);
      return res.status(500).json({
        error: "Lỗi khi chạy model Python",
        details: errorOutput.trim(),
      });
    }

    try {
      const result = JSON.parse(output.trim());

      // Kiểm tra output từ Python có hợp lệ không
      if (!result.input_text) {
        throw new Error("Invalid output from Python script");
      }

      // Chuẩn bị dữ liệu để lưu vào MongoDB
      // Giả sử bạn muốn lưu kết quả PhoBERT làm chính (nếu có), hoặc TF-IDF
      let finalLabel = "REAL";
      let finalProbFake = 0;
      let usedModel = model_type;

      if (model_type === "both" && result.phobert) {
        finalLabel = result.phobert.prediction === 1 ? "FAKE" : "REAL";
        finalProbFake = result.phobert.probability_fake;
        usedModel = "phobert";
      } else if (result.tfidf) {
        finalLabel = result.tfidf.prediction === 1 ? "FAKE" : "REAL";
        finalProbFake = result.tfidf.probability_fake;
        usedModel = "tfidf";
      } else if (result.phobert) {
        finalLabel = result.phobert.prediction === 1 ? "FAKE" : "REAL";
        finalProbFake = result.phobert.probability_fake;
        usedModel = "phobert";
      }

      // Lưu vào MongoDB
      await Prediction.create({
        text: text.trim(),
        result: finalLabel,
        probability: finalProbFake,  // prob fake
        model_used: usedModel,
        details: result,  // lưu full output nếu muốn
      });

      // Trả về cho frontend
      const response = {
        label: finalLabel,
        fake_probability: finalProbFake,
        real_probability: 1 - finalProbFake,
        used_model: usedModel,
        details: result,  // chi tiết cả 2 model nếu both
      };

      res.json(response);
    } catch (err) {
      console.error("Parse error:", err, "Raw output:", output);
      res.status(500).json({
        error: "Lỗi parse kết quả từ Python",
        raw: output.trim(),
      });
    }
  });
});

// GET /history - Lấy lịch sử dự đoán (20 bản ghi gần nhất)
router.get("/history", async (req, res) => {
  try {
    const history = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không lấy được lịch sử" });
  }
});

module.exports = router;