import React, { useCallback } from "react";
import FormContext from "./formContext";
import { useState } from "react";
import api from "../services/api";
import { Building, Users, User } from "lucide-react";
// import  {set}  from "mongoose";

const FormContextProvider = ({ children }) => {
  const [userType, setUserType] = useState("");
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    groupname: "",
  });
  const [profileData, setProfileData] = useState({
    // grpname: "",
    // address: "",
    // network: "",
    // os: "",
    // antivirus: "",
    // roomNo: "",
  });
  // const [selectedFormType, setSelectedFormType] = useState("");
  const [surveyResponses, setSurveyResponses] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [employeeSubmissions, setEmployeeSubmissions] = useState([]);

  const [filterCriteria, setFilterCriteria] = useState({
    formType: "all",
    groupName: "all",
    networkName: "all",
    employeeName: "", // new search filters added
    deviceType: "",
    ipAddress: "",
    macAddress: "",
    os: "",
    serialNo: "",
    coordinatorStatus: "all",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const formIconMap = {
    "group-survey": <Building />,
    Users: <Users />,
    User: <User />,
    Building: <Building />,
    default: <Building />, // A fallback icon
  };

  const [formTypes, setFormTypes] = useState([]);
  // const formTypes = [
  //   { id: "safety", name: "Safety Compliance", icon: "🛡️" },
  //   { id: "quality", name: "Quality Assurance", icon: "⭐" },
  //   { id: "environment", name: "Environmental", icon: "🌱" },
  //   { id: "training", name: "Training & Development", icon: "📚" },
  //   { id: "feedback", name: "Employee Feedback", icon: "💬" },
  //   { id: "performance", name: "Performance Review", icon: "📊" },
  //   { id: "innovation", name: "Innovation Ideas", icon: "💡" },
  //   { id: "wellness", name: "Workplace Wellness", icon: "🏥" },
  //   { id: "communication", name: "Communication", icon: "📢" },
  // ];
  const [surveyQuestions, setSurveyQuestions] = useState([]);

  // const surveyQuestions = Array.from({ length: 30 }, (_, i) => ({
  //   id: i + 1,
  //   question: `This is question ${
  //     i + 1
  //   } for the ${selectedFormType} survey. Please provide your response based on your experience and knowledge.`,
  // }));
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", userData); // Use userData from the component
      return response.data; // Return data on success
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An unexpected error occurred.";
      setError(errorMessage); // Set global error state
      throw new Error(errorMessage); // Throw error to be caught by the component
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.success) {
        setIsLoggedIn(true);
        setProfileData(response.data.data.user.profileData || {});
        // Store token if needed, but httpOnly cookies are handled automatically
        return response.data.data.user;
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const fetchSurveys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the new backend endpoint
      const response = await api.get("/surveys");

      // Map the data from the backend to the format your frontend expects
      const formattedData = response.data.data.map((survey) => ({
        id: survey.formType, // Use formType as the unique ID for the frontend
        name: survey.name,
        icon: survey.icon, // Match icon string to component
      }));

      setFormTypes(formattedData);
    } catch (err) {
      console.error("Failed to fetch surveys:", err);
      setError("Could not load surveys. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSurveyQuestions = useCallback(async (formType) => {
    if (!formType) return; // Prevent API call if formType is not ready

    setIsLoading(true); // You can use the same loading state
    setError(null);
    try {
      // Your backend route is likely /surveys/:formType
      const response = await api.get(`/surveys/${formType}`);
      setSurveyQuestions(response.data.data.questions || []);
    } catch (err) {
      console.error(`Failed to fetch questions for ${formType}:`, err);
      setError("Could not load the survey questions.");
      setSurveyQuestions([]); // Clear questions on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitSurvey = async (submissionData) => {
    try {
      const response = await api.post("/submissions/create", submissionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Submission failed");
    }
  };

  const fetchEmployeeSubmissions = useCallback(async (filters) => {
    try {
      const response = await api.get("/submissions", { params: filters });
      // The backend returns paginated data in 'docs'
      setEmployeeSubmissions(response.data.data.docs || []);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  }, []);

  // Function to fetch current user's submissions
  const fetchMySubmissions = async () => {
    try {
      const response = await api.get("/submissions/my-submissions");
      setEmployeeSubmissions(response.data.data.docs || []);
    } catch (error) {
      console.error("Failed to fetch my submissions:", error);
    }
  };

  const updateSubmissionStatus = async (submissionId, status) => {
    try {
      await api.patch(`/submissions/${submissionId}/status`, { status });
      // After updating, refetch the submissions to show the latest state
      fetchEmployeeSubmissions(filterCriteria);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const createSurvey = async (surveyData) => {
    // The backend `createSurvey` function handles the API call
    // This function can be a wrapper if you need to add more logic
    // For now, let's assume direct API call from the component is fine,
    // but centralizing it here is best practice.
    try {
      const response = await api.post("/surveys/create", surveyData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create survey"
      );
    }
  };

  const updateSurvey = async (formType, surveyData) => {
    try {
      const response = await api.patch(`/surveys/${formType}`, surveyData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update survey"
      );
    }
  };

  const deleteSurvey = async (formType) => {
    try {
      // Your backend uses a PATCH for soft-delete, but a DELETE verb is fine here
      // as long as the route is configured for it.
      const response = await api.delete(`/surveys/${formType}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete survey"
      );
    }
  };

  const value = {
    userType,
    setUserType,
    loginData,
    setLoginData,
    profileData,
    setProfileData,
    // selectedFormType,
    // setSelectedFormType,
    surveyResponses,
    setSurveyResponses,
    isLoggedIn,
    setIsLoggedIn,
    formTypes,
    setFormTypes,
    surveyQuestions,
    login,
    fetchSurveys,
    fetchSurveyQuestions,
    submitSurvey,
    fetchEmployeeSubmissions,
    employeeSubmissions,
    setEmployeeSubmissions,
    filterCriteria,
    setFilterCriteria,
    updateSubmissionStatus,
    setSurveyQuestions,
    isLoading,
    setIsLoading,
    error,
    setError,
    fetchMySubmissions,
    register,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    formIconMap,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
export default FormContextProvider;
