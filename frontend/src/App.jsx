import React, { useState, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  ChevronRight,
  User,
  Users,
  Building,
  ArrowLeft,
  Check,
} from "lucide-react";
import UserTypeSelection from "./components/userTypeSelection";
import Login from "./components/login";
import Profile from "./components/profile";
import Dashboard from "./components/dashboard";
import Survey from "./components/survey";
import Review from "./components/review";
import FormContextProvider from "./contexts/formContextProvider";
import ProtectedRoute from "./components/protectedRoute";
import CoordinatorDashboard from "./components/coordinatorDashboard";
import EmployeeFormsReview from "./components/employeeFormsReview";
import ViewEmployeeResponse from "./components/viewEmployeeResponse";
import GroupHeadLogin from "./components/groupHeadLogin";
import GroupHeadDashboard from "./components/groupHeadDashboard";
import GroupHeadViewEmployeeResponse from "./components/groupHeadViewEmployeeResponse";
import GroupHeadEmployeeFormsReview from "./components/groupHeadEmployeeFormsReview";
import EmployeeSubmissions from "./components/employeeSubmissions";
import EmployeeViewSubmission from "./components/employeeViewSubmission";
import Register from "./components/register";
import ManageSurveys from "./components/manageSurveys"; // Import the Manage Surveys component
// Context for global state management

// Protected Route Component

// User Type Selection Component

// Login Component

// Profile Component

// Dashboard (Form Selection) Component

// Survey Component

// Review Component

// Main App Component
const App = () => {
  return (
    <FormContextProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<UserTypeSelection />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/coordinatorDashboard"
            element={<CoordinatorDashboard />}
          />
          <Route
            path="/employee/submissions"
            element={
              <ProtectedRoute>
                <EmployeeSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/submissions/view/:submissionId"
            element={
              <ProtectedRoute>
                <EmployeeViewSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinatorDashboard/employeeFormsReview"
            element={
              <ProtectedRoute>
                <EmployeeFormsReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinatorDashboard/employeeFormsReview/viewEmployeeResponses/:employeeId"
            element={
              <ProtectedRoute>
                <ViewEmployeeResponse />
              </ProtectedRoute>
            }
          />
          <Route
              path="/coordinator/manage-surveys"
              element={
                  <ProtectedRoute userType="coordinator">
                      <ManageSurveys />
                  </ProtectedRoute>
              }
          />
          <Route path="/grouphead/login" element={<GroupHeadLogin />} />
          <Route
            path="/groupheadDashboard"
            element={
              <ProtectedRoute>
                <GroupHeadDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grouphead/review"
            element={
              <ProtectedRoute>
                <GroupHeadEmployeeFormsReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grouphead/view-response/:employeeId"
            element={
              <ProtectedRoute>
                <GroupHeadViewEmployeeResponse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey/:formType"
            element={
              <ProtectedRoute>
                <Survey />
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey/:formType/review"
            element={
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </FormContextProvider>
  );
};

export default App;
