const express = require("express");
const router = express.Router();
const {
  getAllResults,
  getResultById,
  exportResults,
  getQuizStats,
} = require("../controllers/resultController");
const { auth, authorizeAdmin } = require("../middlewares/auth");

// All routes require admin authentication
router.use(auth);
router.use(authorizeAdmin);

// Get all results with filtering, pagination, and sorting
router.get("/", getAllResults);

// Get details of a single result
router.get("/:resultId", getResultById);

// Export results as CSV
router.get("/export/csv", exportResults);

// Get quiz statistics
router.get("/stats/:quizId", getQuizStats);

module.exports = router;
