import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  FormContext  from "../contexts/formContext"; // Adjust import as needed

const EmployeeSubmissions = () => {
  const {
    employeeSubmissions,
    formTypes,
    fetchMySubmissions,
  } = useContext(FormContext);

  const navigate = useNavigate();

  // Fetch only this employee's submissions on mount
  useEffect(() => {
    fetchMySubmissions();
  }, [fetchMySubmissions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Submitted Forms
        </h2>
        {employeeSubmissions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            You have not submitted any forms yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left">S.No</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Form Type</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Submission Date</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {employeeSubmissions.map((submission, idx) => (
                  <tr key={submission.id || submission._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">{idx + 1}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      {formTypes.find(f => f.id === submission.formType)?.formType || submission.formType}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {submission.submissionDate || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {submission.statusCoordinator || "Pending"}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          navigate(`/employee/submissions/view/${submission.id || submission._id}`)
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSubmissions;
