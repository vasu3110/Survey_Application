// frontend/src/components/SurveyModal.jsx

import React, { useState, useEffect, useContext } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import FormContext from '../contexts/formContext'; // Adjust path to your context

const SurveyModal = ({ isOpen, onClose, onSubmit, initialData = null, isViewMode = false }) => {
  // Get the global survey questions state and the fetch function from context
  const { surveyQuestions, fetchSurveyQuestions } = useContext(FormContext);
  
  // Local state for the form's basic data (name, icon)
  const [formData, setFormData] = useState({ formType: '', name: '', icon: '' });
  // Local state to hold the list of questions for editing
  const [localQuestions, setLocalQuestions] = useState([{ text: '' }]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // This effect runs when the modal is opened for editing or viewing.
  // It fetches the detailed survey data, including its questions.
  useEffect(() => {
    if (isOpen && initialData) {
      setIsLoadingQuestions(true);
      fetchSurveyQuestions(initialData.id)
        .finally(() => setIsLoadingQuestions(false));
      
      // Set the basic form data immediately from the provided initialData.
      setFormData({
        formType: initialData.id,
        name: initialData.name,
        icon: initialData.icon,
      });
    } else if (isOpen) {
      // This is "create" mode. Reset the form completely.
      setFormData({ formType: '', name: '', icon: '' });
      setLocalQuestions([{ text: '' }]);
    }
  }, [isOpen, initialData, fetchSurveyQuestions]);

  // This effect syncs the globally fetched surveyQuestions into the modal's local state.
  useEffect(() => {
    if (initialData && surveyQuestions.length > 0) {
      setLocalQuestions(surveyQuestions.map(q => ({ text: q.question || '' })));
    }
  }, [surveyQuestions, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...localQuestions];
    newQuestions[index].text = value;
    setLocalQuestions(newQuestions);
  };

  const addQuestion = () => setLocalQuestions([...localQuestions, { text: '' }]);

  const removeQuestion = (index) => {
    if (localQuestions.length > 1) {
      setLocalQuestions(localQuestions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return; // Prevent submission in view-only mode
    const finalData = { ...formData, questions: localQuestions };
    onSubmit(finalData);
  };

  const modalTitle = isViewMode ? 'View Survey Details' : (initialData ? 'Update Survey' : 'Create New Survey');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{modalTitle}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Form Type (Unique ID)</label>
            <input
              type="text"
              name="formType"
              value={formData.formType ?? ''}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="e.g., safety-compliance-q1"
              required
              disabled={!!initialData} // Disable formType for existing surveys
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Survey Name</label>
            <input
              type="text"
              name="name"
              value={formData.name ?? ''}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded"
              required
              disabled={isViewMode}
            />
          </div>
          <hr />
          <h3 className="text-lg font-semibold">Questions</h3>
          {isLoadingQuestions ? (
            <p>Loading questions...</p>
          ) : (
            <>
              {localQuestions.map((q, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={q.text ?? ''}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder={`Question ${index + 1}`}
                    required
                    disabled={isViewMode}
                  />
                  {!isViewMode && (
                    <button type="button" onClick={() => removeQuestion(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              {!isViewMode && (
                <button type="button" onClick={addQuestion} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                  <PlusCircle size={20} />
                  <span>Add Question</span>
                </button>
              )}
            </>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
            {!isViewMode && (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {initialData ? 'Update Survey' : 'Create Survey'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyModal;
