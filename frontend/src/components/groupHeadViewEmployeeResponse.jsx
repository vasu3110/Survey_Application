import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import FormContext from "../contexts/formContext";

const GroupHeadViewEmployeeResponse = () => {
  const { employeeSubmissions, formTypes, surveyQuestions, profileData ,fetchSurveyQuestions} =
    React.useContext(FormContext);

  const navigate = useNavigate();
  const { employeeId } = useParams();
  // console.log(employeeId);
  console.log(formTypes)
  if (!employeeSubmissions || employeeSubmissions.length === 0) {
    return <div>Loading submissions...</div>;
  }
  if (!formTypes || formTypes.length === 0) {
    return <div>Loading form types...</div>;
  }

  const submission = employeeSubmissions.find(
    (sub) =>
      parseInt(sub.employeeId) === parseInt(employeeId) &&
      sub.groupName === profileData.groupName
  );
  console.log(submission)
  // useEffect(() => {
  //     // Fetch survey questions when the component mounts
  //     if (submission.formType) {
  //       fetchSurveyQuestions(submission.formType);
  //     }
  //   }, [submission.formType, fetchSurveyQuestions]);
  
  useEffect(() => {
      if (submission && submission.formType) {
        fetchSurveyQuestions(submission.formType);
      }
      // eslint-disable-next-line
    }, [submission, fetchSurveyQuestions]);
  
    // Wait for questions to load
    if (!surveyQuestions || surveyQuestions.length === 0) {
      return <div>Loading survey questions...</div>;
    }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Submission Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            This submission doesn't exist or doesn't belong to your group.
          </p>
          <button
            onClick={() => navigate("/grouphead/review")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Review
          </button>
        </div>
      </div>
    );
  }
  if (!surveyQuestions || surveyQuestions.length === 0) {
    return <div>Loading survey questions...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/grouphead/review")}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Review
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Employee Response Details
            </h2>
            <div></div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Submission Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Employee Name:</strong> {submission.employeeName}
              </p>
              <p>
                <strong>Group:</strong> {submission.groupName}
              </p>
              <p>
                <strong>Network:</strong> {submission.networkName}
              </p>
              <p>
                <strong>Device Type:</strong> {submission.deviceType}
              </p>
              <p>
                <strong>Form Type:</strong>{" "}
                {formTypes.find((f) => f.id === submission.formType)?.formType || submission.formType}
              </p>
              <p>
                <strong>Submission Date:</strong> {submission.submissionDate}
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
                      {submission.responses[question.id]?.remark ||
                        "No remarks"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">
              Status Information
            </h3>
            <div className="flex space-x-6">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Group Head Status:{" "}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    submission.statusGroupHead === "approved"
                      ? "bg-green-100 text-green-800"
                      : submission.statusGroupHead === "not approved"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {submission.statusGroupHead}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Coordinator Status:{" "}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    submission.statusCoordinator === "approved"
                      ? "bg-green-100 text-green-800"
                      : submission.statusCoordinator === "not approved"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {submission.statusCoordinator}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GroupHeadViewEmployeeResponse;
