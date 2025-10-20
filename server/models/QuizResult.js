const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz ID is required"],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    answers: [
      {
        question: {
          type: String,
          required: true,
        },
        selectedAnswer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: 0,
    },
    total: {
      type: Number,
      required: [true, "Total questions is required"],
      min: 1,
    },
    percent: {
      type: Number,
      required: [true, "Percentage is required"],
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
quizResultSchema.index({ quizId: 1, userId: 1 });
quizResultSchema.index({ completedAt: -1 });
quizResultSchema.index({ percent: -1 });

module.exports = mongoose.model("QuizResult", quizResultSchema);
