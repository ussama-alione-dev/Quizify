const User = require("../models/User");
const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");

const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.userId;

    // Get the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Calculate score
    let score = 0;
    const submittedAnswers = [];

    for (const answer of answers) {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (!question) continue;

      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score++;

      submittedAnswers.push({
        question: question.question,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      });
    }

    const finalScore = (score / quiz.questions.length) * 100;

    // Save to user's quiz history
    const user = await User.findById(userId);
    user.quizHistory.push({
      quiz: quizId,
      score: finalScore,
      answers: submittedAnswers,
    });
    await user.save();

    // Save to QuizResult collection for admin analytics
    const quizResult = new QuizResult({
      quizId,
      userId,
      answers: submittedAnswers,
      score,
      total: quiz.questions.length,
      percent: finalScore,
    });
    await quizResult.save();

    res.status(200).json({
      score: finalScore,
      totalQuestions: quiz.questions.length,
      correctAnswers: score,
      answers: submittedAnswers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuizHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .populate({
        path: "quizHistory.quiz",
        select: "title description",
      })
      .select("quizHistory");

    res.status(200).json({ quizHistory: user.quizHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitQuiz,
  getQuizHistory,
};
