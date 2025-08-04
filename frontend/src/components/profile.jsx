// src/components/profile.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormContext from "../contexts/formContext";
import { authService } from "../services/authService";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const { profileData, setProfileData, userType } = useContext(FormContext);
  const navigate = useNavigate();
  const [phoneError, setPhoneError] = useState("");

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // PHONE VALIDATION
    if (!/^\d{10}$/.test(profileData.phone)) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    } else {
      setPhoneError("");
    }

    try {
      await authService.updateProfile(profileData);
      navigate("/dashboard");
    } catch (error) {
      alert(
        "Error updating profile: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  // Only allow digits, max 10 chars
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setProfileData({ ...profileData, phone: digits.slice(0, 10) });
    if (phoneError) setPhoneError(""); // clear error as user types
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {userType === "coordinator" && (
            <button
              onClick={() => navigate("/coordinatorDashboard")}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          )}
          {(userType === "grouphead" || userType === "employee") && (
            <button
              onClick={() => navigate("/groupheadDashboard")}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          )}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Profile Information
          </h2>
          <form
            onSubmit={handleProfileSubmit}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.name ?? ""}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={profileData.department ?? ""}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      department: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={profileData.employeeId ?? ""}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      employeeId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={profileData.designation ?? ""}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      designation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Phone with validation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.phone ?? ""}
                  onChange={handlePhoneChange}
                  pattern="\d{10}"
                  maxLength={10}
                  inputMode="numeric"
                  className={`w-full px-3 py-2 border ${
                    phoneError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                  placeholder="Enter 10-digit phone number"
                />
                {phoneError && (
                  <p className="text-red-600 text-xs mt-1">{phoneError}</p>
                )}
              </div>
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={profileData.grpname ?? ""}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      grpname: e.target.value,
                      groupName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue to Survey
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
