import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, ChevronRight, FileText, Group } from "lucide-react";
import  FormContext  from "../contexts/formContext"; // Adjust import as per your context

const GroupHeadDashboard = () => {
  const navigate = useNavigate();
  const { userType } = useContext(FormContext); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {userType === "grouphead" ? "Group Head Dashboard" : "Employee Dashboard"}
        </h1>
        <div className="space-y-4">
          {/* Fill Survey Card (common for both) */}
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
              Complete survey forms {userType === "grouphead" ? "as group head" : "as employee"}
            </p>
          </div>

          {/* Group Head: Review Employee Forms */}
          {userType === "grouphead" && (
            <div
              onClick={() => navigate("/grouphead/review")}
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
                Review and approve forms from your group members
              </p>
            </div>
          )}

          {/* Employee: View My Submissions */}
          {userType === "employee" && (
            <div
              onClick={() => navigate("/employee/submissions")}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <span className="text-lg font-semibold text-gray-800">
                    My Submitted Forms
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm mt-2">
                View your submitted survey forms
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupHeadDashboard;
