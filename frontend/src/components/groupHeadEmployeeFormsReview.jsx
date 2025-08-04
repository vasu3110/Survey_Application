import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FormContext from "../contexts/formContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GroupHeadEmployeeFormsReview = () => {
  const {
    employeeSubmissions,
    formTypes,
    profileData,
    fetchSurveys,
    fetchEmployeeSubmissions,
    updateSubmissionStatus,
  } = useContext(FormContext);

  const navigate = useNavigate();

  const [sortCriteria, setSortCriteria] = useState({
    networkName: "all",
    formType: "all",
    sortBy: "submissionDate",
    groupHeadStatus: "all", // Added status filter
  });

  const [localSearchFilters, setLocalSearchFilters] = useState({
    employeeName: "",
    deviceType: "",
    ipAddress: "",
    macAddress: "",
    os: "",
    serialNo: "",
  });

  useEffect(() => {
    fetchEmployeeSubmissions(sortCriteria);
  }, [sortCriteria, fetchEmployeeSubmissions]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleStatusUpdate = (submissionId, newStatus) => {
    updateSubmissionStatus(submissionId, newStatus);
  };

  // Filter submissions to those belonging to this group
  let groupSubmissions = employeeSubmissions.filter(
    (submission) => submission.groupName === profileData.groupName
  );

  // Filter by Group Head Status if not "all"
  if (sortCriteria.groupHeadStatus !== "all") {
    groupSubmissions = groupSubmissions.filter(
      (submission) =>
        submission.statusGroupHead === sortCriteria.groupHeadStatus
    );
  }

  // Filter by Network if not "all"
  if (sortCriteria.networkName !== "all") {
    groupSubmissions = groupSubmissions.filter(
      (submission) => submission.networkName === sortCriteria.networkName
    );
  }

  // Filter by Form Type if not "all"
  if (sortCriteria.formType !== "all") {
    groupSubmissions = groupSubmissions.filter(
      (submission) => submission.formType === sortCriteria.formType
    );
  }

  // Apply search filters - case insensitive substring match
  const filteredSubmissions = groupSubmissions.filter((submission) => {
    return (
      (!localSearchFilters.employeeName ||
        submission.employeeName
          ?.toLowerCase()
          .includes(localSearchFilters.employeeName.toLowerCase())) &&
      (!localSearchFilters.deviceType ||
        submission.deviceType
          ?.toLowerCase()
          .includes(localSearchFilters.deviceType.toLowerCase())) &&
      (!localSearchFilters.ipAddress ||
        submission.ipAddress
          ?.toLowerCase()
          .includes(localSearchFilters.ipAddress.toLowerCase())) &&
      (!localSearchFilters.macAddress ||
        submission.macAddress
          ?.toLowerCase()
          .includes(localSearchFilters.macAddress.toLowerCase())) &&
      (!localSearchFilters.os ||
        submission.os
          ?.toLowerCase()
          .includes(localSearchFilters.os.toLowerCase())) &&
      (!localSearchFilters.serialNo ||
        submission.serialNo
          ?.toLowerCase()
          .includes(localSearchFilters.serialNo.toLowerCase()))
    );
  });

  // Sort the filtered submissions
  filteredSubmissions.sort((a, b) => {
    if (sortCriteria.sortBy === "submissionDate") {
      return new Date(b.submissionDate) - new Date(a.submissionDate);
    }
    if (sortCriteria.sortBy === "employeeName") {
      return a.employeeName.localeCompare(b.employeeName);
    }
    if (sortCriteria.sortBy === "networkName") {
      return a.networkName.localeCompare(b.networkName);
    }
    return 0;
  });

  const uniqueNetworks = [
    ...new Set(
      employeeSubmissions
        .filter((sub) => sub.groupName === profileData.groupName)
        .map((sub) => sub.networkName)
    ),
  ];

  // Handlers for search input changes
  const handleLocalSearchChange = (e) => {
    const { name, value } = e.target;
    setLocalSearchFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset search inputs
  const handleResetSearch = () => {
    setLocalSearchFilters({
      employeeName: "",
      deviceType: "",
      ipAddress: "",
      macAddress: "",
      os: "",
      serialNo: "",
    });
  };

  // Reset all filters (including status and sort)
  const handleResetFilters = () => {
    setSortCriteria({
      networkName: "all",
      formType: "all",
      sortBy: "submissionDate",
      groupHeadStatus: "all",
    });
    handleResetSearch();
  };
  const exportToPDF = (submissions) => {
    const doc = new jsPDF();

    const tableColumn = [
      "S.No",
      "Employee Name",
      "Group Name",
      "Network Name",
      "Device Type",
      "IP Address",
      "MAC Address",
      "OS",
      "Serial No",
      "Form Type",
      "Submission Date",
      "Group Head Status",
    ];

    const tableRows = submissions.map((sub, index) => [
      index + 1,
      sub.employeeName,
      sub.groupName,
      sub.networkName,
      sub.deviceType,
      sub.ipAddress,
      sub.macAddress,
      sub.os,
      sub.serialNo,
      sub.formType,
      new Date(sub.submissionDate).toLocaleString(),
      sub.statusGroupHead,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      startY: 20,
    });

    doc.save("grouphead_submission_report.pdf");
  };

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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Head Status
                </label>
                <select
                  value={sortCriteria.groupHeadStatus}
                  onChange={(e) =>
                    setSortCriteria({
                      ...sortCriteria,
                      groupHeadStatus: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Forms</option>
                  <option value="approved">Approved Forms</option>
                  <option value="not approved">Rejected Forms</option>
                  <option value="pending">Pending Forms</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Search Inputs Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">
              Search Submissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    value={localSearchFilters[name]}
                    onChange={handleLocalSearchChange}
                    placeholder={`Search by ${label.toLowerCase()}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleResetSearch}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Search
              </button>
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
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
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
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission, index) => (
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
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {new Date(submission.submissionDate).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            navigate(
                              `/grouphead/view-response/${submission.employeeId}`
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
                        {submission.statusGroupHead === "pending" ? (
                          <div className="flex space-x-1 justify-center">
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
                                handleStatusUpdate(
                                  submission._id,
                                  "not approved"
                                )
                              }
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="15" className="text-center py-8 text-gray-500">
                      No submissions found for your group matching the current
                      filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => exportToPDF(employeeSubmissions)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeadEmployeeFormsReview;
