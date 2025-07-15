import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import FormContext from "../contexts/formContext";

const GroupHeadEmployeeFormsReview = () => {
  const {
    employeeSubmissions,
    formTypes,
    profileData,
    fetchSurveys,
    fetchEmployeeSubmissions, // Use the same function
    updateSubmissionStatus, // Use the same function
  } = useContext(FormContext);
  const navigate = useNavigate();

  const [sortCriteria, setSortCriteria] = useState({
    networkName: "all",
    formType: "all",
    sortBy: "submissionDate",
  });

  useEffect(() => {
    // The backend automatically scopes this to the group head's group
    fetchEmployeeSubmissions(sortCriteria);
  }, [sortCriteria, fetchEmployeeSubmissions]);
  useEffect(() => {
      fetchSurveys();
    }, [fetchSurveys]);

  const handleStatusUpdate = (submissionId, newStatus) => {
    updateSubmissionStatus(submissionId, newStatus);
  };

  // Filter submissions by group head's group
  const groupSubmissions = employeeSubmissions.filter(
    (submission) => submission.groupName === profileData.groupName
  );

  // Apply additional filters and sorting
  let filteredSubmissions = employeeSubmissions;
  console.log(filteredSubmissions)
  // Sort submissions
  filteredSubmissions.sort((a, b) => {
    if (sortCriteria.sortBy === "submissionDate") {
      return new Date(b.submissionDate) - new Date(a.submissionDate);
    } else if (sortCriteria.sortBy === "employeeName") {
      return a.employeeName.localeCompare(b.employeeName);
    } else if (sortCriteria.sortBy === "networkName") {
      return a.networkName.localeCompare(b.networkName);
    }
    return 0;
  });

  const uniqueNetworks = [
    ...new Set(groupSubmissions.map((sub) => sub.networkName)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/grouphead/dashboard")}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Group Employee Submissions - {profileData.groupName}
            </h2>
            <div></div>
          </div>

          {/* Filters and Sorting */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">
              Filter & Sort Submissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select
                  value={sortCriteria.networkName}
                  onChange={(e) =>
                    setSortCriteria({
                      ...sortCriteria,
                      networkName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Networks</option>
                  {uniqueNetworks.map((network) => (
                    <option key={network} value={network}>
                      {network}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Type
                </label>
                <select
                  value={sortCriteria.formType}
                  onChange={(e) =>
                    setSortCriteria({
                      ...sortCriteria,
                      formType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Forms</option>
                  {formTypes.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortCriteria.sortBy}
                  onChange={(e) =>
                    setSortCriteria({ ...sortCriteria, sortBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="submissionDate">Submission Date</option>
                  <option value="employeeName">Employee Name</option>
                  <option value="networkName">Network Name</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() =>
                    setSortCriteria({
                      networkName: "all",
                      formType: "all",
                      sortBy: "submissionDate",
                    })
                  }
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    S.No
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Employee Name
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Group Name
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Network Name
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Device Type
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Form Type
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    Submission Date
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    View Response
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    Group Head Status
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    Coordinator Status
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission, index) => (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
                      {submission.employeeName}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {submission.groupName}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {submission.networkName}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {submission.deviceType}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {formTypes.find((f) => f.id === submission.formType)
                        ?.formType || submission.formType}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                      {submission.submissionDate}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          navigate(`/grouphead/view-response/${submission.employeeId}`)
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
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
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
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
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {submission.statusGroupHead === "pending" && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() =>
                              handleStatusUpdate(submission._id, "approved")
                            }
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(submission._id, "not approved")
                            }
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {submission.statusGroupHead !== "pending" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(submission._id, "pending")
                          }
                          className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No submissions found for your group matching the current
                filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default GroupHeadEmployeeFormsReview;
