const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const authRouter = require("./routes/auth");
const quizRouter = require("./routes/quizRouter");
const quizSubmissionRouter = require("./routes/quizSubmission");
const resultRouter = require("./routes/resultRouter");

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: Object.values(err.errors)
        .map((val) => val.message)
        .join(", "),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      error: "Email already exists",
    });
  }

  res.status(500).json({
    error: err.message || "Something went wrong!",
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/quiz-submissions", quizSubmissionRouter);
app.use("/api/results", resultRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB...");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
