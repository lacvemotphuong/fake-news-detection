const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  text: String,
  result: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prediction", PredictionSchema);
