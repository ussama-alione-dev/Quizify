import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ClipboardList, History } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("quizzes");

  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/api/quiz", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return data;
    },
  });

  const { data: quizHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["quiz-history"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/quiz-submissions/history",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return data.quizHistory;
    },
  });

  if (isLoadingQuizzes || isLoadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/">
                <h1 className="text-2xl font-bold text-gray-900">Quizify</h1>
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("quizzes")}
                className={`${
                  activeTab === "quizzes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <ClipboardList className="h-5 w-5 mr-2" />
                Available Quizzes
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <History className="h-5 w-5 mr-2" />
                Quiz History
              </button>
            </nav>
          </div>

          {activeTab === "quizzes" ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes?.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      {quiz.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {quiz.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {quiz.questions.length} questions
                    </p>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <button
                      onClick={() => navigate(`/quiz/${quiz._id}`)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Take Quiz →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {quizHistory?.map((history) => (
                    <li key={history._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">
                              {/* {history.quiz.title} */}
                            </h4>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              Score: {history.score.toFixed(2)}%
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(history.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
