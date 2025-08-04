import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FormContext from "../contexts/formContext"; // adjust import based on your setup
import { useParams } from "react-router-dom";
import api from "../services/api";

const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

const SystemSpecifications = () => {
  const { profileData } = useContext(FormContext);
  const { formType } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deviceType: "",
    deviceName: "",
    serialNo: "",
    model: "",
    os: "",
    ipAddress: "",
    macAddress: "",
    antivirus: "",
    network: "",
    roomNo: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.deviceType.trim())
      errs.deviceType = "Device Type is required.";
    if (!formData.deviceName.trim())
      errs.deviceName = "Device Name is required.";
    if (!formData.serialNo.trim()) errs.serialNo = "Serial Number is required.";
    if (!formData.model.trim()) errs.model = "Model is required.";
    if (!formData.os.trim()) errs.os = "OS is required.";
    if (!formData.ipAddress.trim()) {
      errs.ipAddress = "IP Address is required.";
    } else if (!ipv4Regex.test(formData.ipAddress.trim())) {
      errs.ipAddress = "Invalid IPv4 address format.";
    }
    if (!formData.macAddress.trim()) {
      errs.macAddress = "MAC Address is required.";
    } else if (!macRegex.test(formData.macAddress.trim())) {
      errs.macAddress = "Invalid MAC address format.";
    }
    if (!formData.antivirus.trim()) errs.antivirus = "Antivirus is required.";
    if (!formData.network.trim()) errs.network = "Network is required.";
    if (!formData.roomNo) {
      errs.roomNo = "Room Number is required.";
    } else if (isNaN(Number(formData.roomNo))) {
      errs.roomNo = "Room Number must be a number.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    setErrors({});

    try {
      const checkRes = await api.post("/systems/check-system-submission", {
        serialNo: formData.serialNo,
        formType,
      });

      const message = checkRes.data.message;
      const data = checkRes.data.data;
      if (message === "System found, no submission yet" && data?.systemId) {
        // Proceed with existing system
        navigate(`/survey/${formType}?systemId=${data.systemId}`);
      } else if (message === "System not found, needs creation" || !data) {
        // Create system then proceed
        const payload = {
          ...formData,
          roomNo: Number(formData.roomNo),
          user: profileData?._id,
        };

        const createRes = await api.post("/systems/create", payload);
        navigate(`/survey/${formType}?systemId=${createRes.data.data._id}`);
      } else if (
        checkRes.status === 409 ||
        message === "Submission already exists for this system"
      ) {
        setSubmitError(
          "You have already submitted this survey using this device."
        );
      } else {
        // Fallback: unexpected response, possibly navigate without systemId
        navigate(`/survey/${formType}`);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setSubmitError(
          "You have already submitted this survey using this device."
        );
      } else {
        setSubmitError(
          err.response?.data?.message || "Failed to proceed. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Enter System Specifications
        </h1>

        {submitError && (
          <div className="mb-4 text-red-600 font-medium">{submitError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {[
            { label: "Device Type", name: "deviceType", type: "text" },
            { label: "Device Name", name: "deviceName", type: "text" },
            { label: "Serial Number", name: "serialNo", type: "text" },
            { label: "Model", name: "model", type: "text" },
            { label: "Operating System (OS)", name: "os", type: "text" },
            { label: "IP Address", name: "ipAddress", type: "text" },
            { label: "MAC Address", name: "macAddress", type: "text" },
            { label: "Antivirus", name: "antivirus", type: "text" },
            { label: "Network", name: "network", type: "text" },
            { label: "Room Number", name: "roomNo", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors[name]
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder={`Enter ${label}`}
              />
              {errors[name] && (
                <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Proceed to Survey"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SystemSpecifications;
