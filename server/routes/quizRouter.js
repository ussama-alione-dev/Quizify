const express = require("express");
const router = express.Router();
const {
  getAllQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");
const { auth, authorizeAdmin } = require("../middlewares/auth");

router.get("/", auth, getAllQuizzes);
router.get("/:id", auth, getQuiz);
router.post("/", auth, authorizeAdmin, createQuiz);
router.put("/:id", auth, authorizeAdmin, updateQuiz);
router.delete("/:id", auth, authorizeAdmin, deleteQuiz);

module.exports = router;
