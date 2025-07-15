import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import FormContext from "../contexts/formContext";
const Survey = () => {
  const { formType } = useParams();
  const {
    formTypes,
    surveyResponses,
    setSurveyResponses,
    surveyQuestions,
    fetchSurveyQuestions,
  } = useContext(FormContext);
  if (!formType) {
    throw new Error(
      "Selected form type must be set before using Survey component"
    );
  }
  if (!surveyQuestions) {
    throw new Error(
      "Survey questions must be loaded before using Survey component"
    );
  }
  if (!formTypes) {
    throw new Error("Form types must be loaded before using Survey component");
  }
  if (!formTypes || !formType) {
    throw new Error(
      "Form types and selected form type must be set before using Survey component"
    );
  }
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch survey questions when the component mounts
    if (formType) {
      fetchSurveyQuestions(formType);
    }
  }, [formType, fetchSurveyQuestions]);

  const handleSurveyResponseChange = (questionId, field, value) => {
    setSurveyResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const handleSurveySubmit = () => {
    const allAnswered = surveyQuestions.every(
      (q) => surveyResponses[q.id] && surveyResponses[q.id].response
    );

    if (allAnswered) {
      navigate(`/survey/${formType}/review`);
    } else {
      alert("Please answer all questions before submitting.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Survey Types
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {formTypes.find((f) => f.id === formType)?.id} Survey
            </h2>
            <div></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
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
                      <div className="flex justify-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            value="Yes"
                            checked={
                              surveyResponses[question.id]?.response === "Yes"
                            }
                            onChange={(e) =>
                              handleSurveyResponseChange(
                                question.id,
                                "response",
                                e.target.value
                              )
                            }
                            className="mr-1"
                            required
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            value="No"
                            checked={
                              surveyResponses[question.id]?.response === "No"
                            }
                            onChange={(e) =>
                              handleSurveyResponseChange(
                                question.id,
                                "response",
                                e.target.value
                              )
                            }
                            className="mr-1"
                            required
                          />
                          No
                        </label>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <textarea
                        value={surveyResponses[question.id]?.remark || ""}
                        onChange={(e) =>
                          handleSurveyResponseChange(
                            question.id,
                            "remark",
                            e.target.value
                          )
                        }
                        placeholder="Add remarks..."
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm resize-none"
                        rows="2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleSurveySubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Review Responses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Survey;
