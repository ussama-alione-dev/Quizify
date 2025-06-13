const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: 500,
    },
    questions: [
      {
        question: {
          type: String,
          required: [true, "Please provide a question"],
        },
        options: {
          type: [String],
          required: [true, "Please provide options"],
          validate: {
            validator: function (options) {
              return options.length === 4;
            },
            message: "Each question must have exactly 4 options",
          },
        },
        correctAnswer: {
          type: String,
          required: [true, "Please provide the correct answer"],
          validate: {
            validator: function (answer) {
              return this.options.includes(answer);
            },
            message: "Correct answer must be one of the options",
          },
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
