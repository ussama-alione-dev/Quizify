import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/quiz/${quizId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return data;
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answers) => {
      const { data } = await axios.post(
        "http://localhost:5000/api/quiz-submissions/submit",
        {
          quizId,
          answers,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success("Quiz submitted successfully!");
      navigate("/dashboard", { state: { quizResult: data } });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Error submitting quiz");
      setIsSubmitting(false);
    },
  });

  const handleAnswerSelect = (selectedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: quiz.questions[currentQuestion]._id,
      selectedAnswer,
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.length !== quiz.questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    submitQuizMutation.mutate(answers);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Link to="/dashboard" className="text-xl text-blue font-semibold">
        &larr; Back
      </Link>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{quiz.description}</p>
          </div>

          <div className="px-6 py-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </h3>
                <p className="mt-2 text-gray-600">{question.question}</p>
              </div>

              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={option}
                      checked={
                        answers[currentQuestion]?.selectedAnswer === option
                      }
                      onChange={() => handleAnswerSelect(option)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label className="ml-3 block text-gray-700">{option}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
