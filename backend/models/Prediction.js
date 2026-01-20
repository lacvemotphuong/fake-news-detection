const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },

    result: {
      type: String,
      enum: ["FAKE", "REAL"],
      required: true
    },

    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Prediction", PredictionSchema);
