// src/pages/EmployeeViewSubmission.jsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import  FormContext  from "../contexts/formContext.js"; // Adjust import as needed

const EmployeeViewSubmission = () => {
  const {
    employeeSubmissions,
    formTypes,
    surveyQuestions,
    fetchSurveyQuestions,
  } = React.useContext(FormContext);

  const { submissionId } = useParams();
  const navigate = useNavigate();

  // Find the submission by id
  const submission = employeeSubmissions.find(
    (sub) => String(sub.id || sub._id) === String(submissionId)
  );

  // Fetch the questions for this submission's formType
  useEffect(() => {
    if (submission && submission.formType) {
      fetchSurveyQuestions(submission.formType);
    }
    // eslint-disable-next-line
  }, [submission, fetchSurveyQuestions]);

  if (!employeeSubmissions || employeeSubmissions.length === 0) {
    return <div>Loading submissions...</div>;
  }

  if (!formTypes || formTypes.length === 0) {
    return <div>Loading form types...</div>;
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Submission Not Found
        </h2>
        <button
          onClick={() => navigate("/employee/submissions")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to My Submissions
        </button>
      </div>
    );
  }

  if (!surveyQuestions || surveyQuestions.length === 0) {
    return <div>Loading survey questions...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/employee/submissions")}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to My Submissions
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              My Submitted Form Details
            </h2>
            <div></div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Submission Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Form Type:</strong>{" "}
                {formTypes.find((f) => f.id === submission.formType)?.id ||
                  submission.formType}
              </p>
              <p>
                <strong>Submission Date:</strong> {submission.submissionDate}
              </p>
              <p>
                <strong>Status:</strong> {submission.statusCoordinator || "Pending"}
              </p>
            </div>
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
                          submission.responses[question.id]?.response === "Yes"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {submission.responses[question.id]?.response ||
                          "No Response"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {submission.responses[question.id]?.remark || "No remarks"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewSubmission;
