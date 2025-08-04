import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import FormContext from "../contexts/formContext";
import { ArrowLeft } from "lucide-react";
import { Building, Users, User } from "lucide-react";

const Dashboard = () => {
  const { formTypes, isLoading, error, fetchSurveys, formIconMap } =
    useContext(FormContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]); // The dependency array ensures this runs only once on mount

  const handleFormTypeSelect = (formType) => {
    // setSelectedFormType(formType);
    // You'll likely fetch specific questions for this formType on the next page
    navigate(`/survey/systemspecs/${formType}`);
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="animate-spin text-blue-500 h-12 w-12" />
        <span className="ml-4 text-xl text-gray-600">Loading Surveys...</span>
      </div>
    );
  }

  // Display an error message if the fetch failed
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        <p>{error}</p>
      </div>
    );
  }

  // Render the main component content once data is available
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Select Survey Type
          </h2>
          <p className="text-gray-600">
            Choose the type of survey you want to complete
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formTypes.map((form) => (
            <div
              key={form.id}
              onClick={() => handleFormTypeSelect(form.id)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-300"
            >
              <div className="text-center">
                <div className="flex justify-center text-blue-500 text-4xl mb-4">
                  {formIconMap[form.icon] || formIconMap.default}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {form.id}
                </h3>
                <p className="text-gray-600 text-sm">
                  Click to start this survey
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
