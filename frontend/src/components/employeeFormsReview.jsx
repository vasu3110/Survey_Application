import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import FormContext from "../contexts/formContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const EmployeeFormsReview = () => {
  const {
    employeeSubmissions, // Comes from API
    filterCriteria,
    setFilterCriteria,
    formTypes,
    fetchEmployeeSubmissions,
    updateSubmissionStatus,
    fetchSurveys,
  } = React.useContext(FormContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  // Fetch submissions whenever filters change
  useEffect(() => {
    fetchEmployeeSubmissions(filterCriteria);
  }, [filterCriteria, fetchEmployeeSubmissions]);

  const [localFilters, setLocalFilters] = React.useState({
    employeeName: filterCriteria.employeeName || "",
    deviceType: filterCriteria.deviceType || "",
    ipAddress: filterCriteria.ipAddress || "",
    macAddress: filterCriteria.macAddress || "",
    os: filterCriteria.os || "",
    serialNo: filterCriteria.serialNo || "",
    coordinatorStatus: filterCriteria.coordinatorStatus || "all", // new field with default "all"
  });

  // Handle input change, updating only local state
  const handleLocalFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  // On submit of filters, update global filter state which triggers API fetch
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setFilterCriteria((prev) => ({
      ...prev,
      ...localFilters,
    }));
  };

  if (!formTypes || formTypes.length === 0) {
    return <div>Loading form types...</div>;
  }

  const uniqueGroups = [
    ...new Set(employeeSubmissions.map((sub) => sub.groupName).filter(Boolean)),
  ];

  const uniqueNetworks = [
    ...new Set(
      employeeSubmissions.map((sub) => sub.networkName).filter(Boolean)
    ),
  ];

  const handleStatusUpdate = (submissionId, newStatus) => {
    updateSubmissionStatus(submissionId, newStatus);
  };

  const filteredSubmissions = employeeSubmissions;
  const exportToExcel = (data) => {
    // Map data to the columns you want
    const worksheetData = data.map((submission) => ({
      "Device Type": submission.deviceType,
      "Device Name": submission.deviceName,
      "Serial No": submission.serialNo,
      Model: submission.model,
      "IP Address": submission.ipAddress,
      "MAC Address": submission.macAddress,
      "Operating System": submission.os,
      "Employee Name": submission.employeeName,
      "Group Name": submission.groupName,
      "Network Name": submission.networkName,
      "Form Type": submission.formType,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Optional: set column widths, styles etc.

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

    // Generate buffer
    const wbout = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save file locally
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "submissions_report.xlsx"
    );
  };
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

          {/* Filters Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">
              Filter Submissions
            </h3>
            <form
              onSubmit={handleFilterSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
              {/* Existing filters: Form Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Type
                </label>
                <select
                  name="formType"
                  value={localFilters.formType || filterCriteria.formType}
                  onChange={handleLocalFilterChange}
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

              {/* Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group
                </label>
                <select
                  name="groupName"
                  value={localFilters.groupName || filterCriteria.groupName}
                  onChange={handleLocalFilterChange}
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

              {/* Network */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select
                  name="networkName"
                  value={localFilters.networkName || filterCriteria.networkName}
                  onChange={handleLocalFilterChange}
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

              {/* Coordinator Status Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coordinator Status
                </label>
                <select
                  name="coordinatorStatus"
                  value={localFilters.coordinatorStatus}
                  onChange={handleLocalFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Forms</option>
                  <option value="approved">Approved Forms</option>
                  <option value="not approved">Rejected Forms</option>
                  <option value="pending">Pending Forms</option>
                </select>
              </div>

              {/* Other Search Inputs: Employee Name, Device Type, IP, MAC, OS, SerialNo */}
              {[
                { label: "Employee Name", name: "employeeName" },
                { label: "Device Type", name: "deviceType" },
                { label: "IP Address", name: "ipAddress" },
                { label: "MAC Address", name: "macAddress" },
                { label: "OS", name: "os" },
                { label: "Serial Number", name: "serialNo" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={localFilters[name]}
                    onChange={handleLocalFilterChange}
                    placeholder={`Search by ${label.toLowerCase()}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              {/* Submit button */}
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
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
                    IP Address
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    MAC Address
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    OS
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Serial No
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
                      {submission.ipAddress}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {submission.macAddress}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {submission.os}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {submission.serialNo}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {formTypes.find((f) => f.id === submission.formType)
                        ?.formType || submission.formType}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                      {new Date(submission.submissionDate).toLocaleString()}
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
          {filteredSubmissions.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => exportToExcel(filteredSubmissions)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Export to Excel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormsReview;
