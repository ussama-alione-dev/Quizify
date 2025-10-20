const mongoose = require("mongoose");
const QuizResult = require("../models/QuizResult");
const Quiz = require("../models/Quiz");
const User = require("../models/User");

// Get all results with filtering, pagination, and sorting
const getAllResults = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      quizId,
      sortBy = "completedAt",
      sortOrder = "desc",
      search,
    } = req.query;

    // Build filter object
    const filter = {};
    if (quizId) filter.quizId = quizId;

    // Build search filter
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      filter.userId = { $in: users.map((user) => user._id) };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get results with pagination
    const results = await QuizResult.find(filter)
      .populate("quizId", "title description")
      .populate("userId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await QuizResult.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      results,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalResults: total,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get details of a single result
const getResultById = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await QuizResult.findById(resultId)
      .populate("quizId", "title description questions")
      .populate("userId", "name email");

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export results as CSV
const exportResults = async (req, res) => {
  try {
    const { quizId } = req.query;

    // Build filter
    const filter = {};
    if (quizId) filter.quizId = quizId;

    // Get all results (no pagination for export)
    const results = await QuizResult.find(filter)
      .populate("quizId", "title")
      .populate("userId", "name email")
      .sort({ completedAt: -1 });

    // Create CSV content
    const csvHeader = [
      "Quiz Title",
      "Student Name",
      "Student Email",
      "Score",
      "Total Questions",
      "Percentage",
      "Completed At",
    ].join(",");

    const csvRows = results.map((result) => {
      return [
        `"${result.quizId.title}"`,
        `"${result.userId.name}"`,
        `"${result.userId.email}"`,
        result.score,
        result.total,
        result.percent,
        result.completedAt.toISOString(),
      ].join(",");
    });

    const csvContent = [csvHeader, ...csvRows].join("\n");

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="quiz-results-${Date.now()}.csv"`
    );

    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quiz statistics
const getQuizStats = async (req, res) => {
  try {
    const { quizId } = req.params;

    const stats = await QuizResult.aggregate([
      { $match: { quizId: mongoose.Types.ObjectId(quizId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: "$percent" },
          highestScore: { $max: "$percent" },
          lowestScore: { $min: "$percent" },
        },
      },
    ]);

    const scoreDistribution = await QuizResult.aggregate([
      { $match: { quizId: mongoose.Types.ObjectId(quizId) } },
      {
        $bucket: {
          groupBy: "$percent",
          boundaries: [0, 25, 50, 75, 100],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    res.status(200).json({
      stats: stats[0] || {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
      },
      scoreDistribution,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllResults,
  getResultById,
  exportResults,
  getQuizStats,
};
