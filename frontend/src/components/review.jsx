// src/components/review.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import FormContext from "../contexts/formContext";
import { useParams, useLocation } from "react-router-dom";
import { submissionService } from "../services/submissionService";

const Review = () => {
  const { formType } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const systemId = searchParams.get("systemId");
  const {
    formTypes,
    surveyResponses,
    surveyQuestions,
    profileData,
    submitSurvey,
  } = useContext(FormContext);
  const navigate = useNavigate();

  const handleFinalSubmit = async () => {
    try {
      // The backend expects profileData to be part of the submission
      await submitSurvey({
        formType,
        responses: surveyResponses,
        profileData,
        systemId,
      });
      alert("Survey submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message); // Show error from backend
    }
  };

  if (!formType || !surveyResponses || !profileData) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(`/survey/${formType}`)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Survey
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Review Your Responses
            </h2>
            <div></div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Survey Details</h3>
            <p>
              <strong>Survey Type:</strong>{" "}
              {formTypes.find((f) => f.id === formType)?.id}
            </p>
            <p>
              <strong>Employee:</strong> {profileData.name}
            </p>
            <p>
              <strong>Department:</strong> {profileData.department}
            </p>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 w-1/2">
                    Question
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 w-1/6">
                    Response
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 w-1/3">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {surveyQuestions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      <span className="font-medium text-blue-600">
                        Q{question.id}:
                      </span>{" "}
                      {question.question}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          surveyResponses[question.id]?.response === "Yes"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {surveyResponses[question.id]?.response}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {surveyResponses[question.id]?.remark || "No remarks"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => navigate(`/survey/${formType}`)}
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              Edit Responses
            </button>
            <button
              onClick={handleFinalSubmit}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-semibold flex items-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Submit Final Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
