import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { uniqueGroups, uniqueNetworks } from "../utils/uniqueValues";
import { ArrowLeft } from "lucide-react";
import FormContext from "../contexts/formContext";
import { submissionService } from "../services/submissionService";

const EmployeeFormsReview = () => {
  const {
    employeeSubmissions, // This will now come from the API
    filterCriteria,
    setFilterCriteria,
    formTypes,
    fetchEmployeeSubmissions, // New function
    updateSubmissionStatus,
    fetchSurveys,
  } = React.useContext(FormContext);

  // if (!employeeSubmissions) {
  //   throw new Error(
  //     "Employee submissions must be loaded before using EmployeeFormsReview component"
  //   );
  // }
  // if (!formTypes) {
  //   throw new Error(
  //     "Form types must be loaded before using EmployeeFormsReview component"
  //   );
  // }
  // if (!filterCriteria) {
  //   throw new Error(
  //     "Filter criteria must be set before using EmployeeFormsReview component"
  //   );
  // }
  // Get unique group names from submissions
  const navigate = useNavigate();
   useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  // 3. Fetch submissions when filter changes
  useEffect(() => {
    fetchEmployeeSubmissions(filterCriteria);
  }, [filterCriteria, fetchEmployeeSubmissions]);

  if (!formTypes || formTypes.length === 0) {
    return <div>Loading form types...</div>;
  }
  
  
  const uniqueGroups = [...new Set(employeeSubmissions.map(sub => sub.groupName).filter(Boolean))];

  // Get unique network names from submissions
  const uniqueNetworks = [...new Set(employeeSubmissions.map(sub => sub.networkName).filter(Boolean))];
  console.log(formTypes)
  

  const handleStatusUpdate = (submissionId, newStatus) => {
    // Call the API function from context
    updateSubmissionStatus(submissionId, newStatus);
  };
  const filteredSubmissions = employeeSubmissions;
  console.log(filteredSubmissions)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/coordinatorDashboard")}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Employee Form Submissions
            </h2>
            <div></div>
          </div>

          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">
              Filter Submissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Type
                </label>
                <select
                  value={filterCriteria.formType}
                  onChange={(e) =>
                    setFilterCriteria({
                      ...filterCriteria,
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
                  Group
                </label>
                <select
                  value={filterCriteria.groupName}
                  onChange={(e) =>
                    setFilterCriteria({
                      ...filterCriteria,
                      groupName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Groups</option>
                  {uniqueGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select
                  value={filterCriteria.networkName}
                  onChange={(e) =>
                    setFilterCriteria({
                      ...filterCriteria,
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
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/coordinatorDashboard/employeeFormsReview/viewEmployeeResponses/${submission.employeeId}`
                          )
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
                      {submission.statusCoordinator === "pending" && (
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
                      {submission.statusCoordinator !== "pending" && (
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
                No submissions found matching the current filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default EmployeeFormsReview;
