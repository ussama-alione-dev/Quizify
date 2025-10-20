import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, Edit2, Trash2, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";
import { CreateQuizModal } from "../components/CreateQuizModal";
import { EditQuizModal } from "../components/EditQuizModal";
import { Link } from "react-router-dom";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const {
    data: quizzes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/api/quiz", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return data;
    },
  });

  const handleDelete = async (quizId) => {
    try {
      await axios.delete(`http://localhost:5000/api/quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Quiz deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting quiz");
    }
  };

  const handleEdit = (quiz) => {
    setSelectedQuiz(quiz);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
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
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/results"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Results
              </Link>
              <span className="text-gray-700">Welcome, {user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quizzes</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Quiz
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {quizzes?.map((quiz) => (
                <li key={quiz._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {quiz.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {quiz.description}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {quiz.questions.length} questions
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(quiz)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(quiz._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Create Quiz Modal */}
      {isCreateModalOpen && (
        <CreateQuizModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            refetch();
          }}
        />
      )}

      {/* Edit Quiz Modal */}
      {isEditModalOpen && (
        <EditQuizModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedQuiz(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedQuiz(null);
            refetch();
          }}
          quiz={selectedQuiz}
        />
      )}
    </div>
  );
};
