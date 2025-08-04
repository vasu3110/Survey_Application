// src/components/coordinatorDashboard.jsx

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
// Import the new icon for the Manage Surveys card
import { ChevronRight, User, Users, LogOut, FileEdit } from "lucide-react";
import FormContext from "../contexts/formContext";
import { authService } from "../services/authService";
import { ArrowLeft } from "lucide-react";
const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  // Assuming 'user' is now provided by the context for the welcome message
  const { setIsLoggedIn, setUserType, user } = useContext(FormContext);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setUserType("");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback logout for client-side state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserType("");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header with user info and logout */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Coordinator Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.username || "Coordinator"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Card 1: Fill Survey Form */}
          <div
            onClick={() => navigate("/profile")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-blue-600" />
                <span className="text-lg font-semibold text-gray-800">
                  Fill Survey Form
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Complete survey forms as coordinator
            </p>
          </div>

          {/* Card 2: Review Employee Forms */}
          <div
            onClick={() =>
              navigate("/coordinatorDashboard/employeeFormsReview")
            }
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-600" />
                <span className="text-lg font-semibold text-gray-800">
                  Review Employee Forms
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Review and approve employee submissions
            </p>
          </div>

          {/* --- NEW CARD: Manage Surveys --- */}
          <div
            onClick={() => navigate("/coordinator/manage-surveys")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileEdit className="h-8 w-8 text-purple-600" />
                <span className="text-lg font-semibold text-gray-800">
                  Manage Surveys
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Create, update, or delete surveys and their questions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
