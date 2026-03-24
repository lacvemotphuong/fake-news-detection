const mongoose = require("mongoose");


const PredictionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
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
    },
    source_link: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);



module.exports = mongoose.model("Prediction", PredictionSchema);
