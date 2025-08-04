// frontend/src/pages/ManageSurveys.jsx

import React, { useState, useEffect, useContext } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import FormContext from "../contexts/formContext"; // Adjust path
import SurveyModal from "./surveyModal"; // Adjust path

const ManageSurveys = () => {
  const { formTypes, fetchSurveys, createSurvey, updateSurvey, deleteSurvey } =
    useContext(FormContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleOpenCreateModal = () => {
    setCurrentSurvey(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (survey) => {
    setCurrentSurvey(survey);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleOpenUpdateModal = (survey) => {
    setCurrentSurvey(survey);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (formType) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      try {
        await deleteSurvey(formType);
        fetchSurveys();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleModalSubmit = async (surveyData) => {
    try {
      if (currentSurvey) {
        await updateSurvey(currentSurvey.id, surveyData);
      } else {
        await createSurvey(surveyData);
      }
      fetchSurveys();
      setIsModalOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSurvey(null);
    setIsViewMode(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Surveys</h1>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Create New Survey</span>
        </button>
      </div>

      <SurveyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialData={currentSurvey}
        isViewMode={isViewMode}
      />

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Form Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formTypes.map((survey) => (
              <tr key={survey.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {survey.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{survey.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(survey.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleOpenViewModal(survey)}
                      className="text-gray-600 hover:text-gray-900"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenUpdateModal(survey)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Update"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(survey.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSurveys;
