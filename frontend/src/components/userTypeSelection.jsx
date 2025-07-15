import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FormContext from "../contexts/formContext";
import { ChevronRight, User, Users, Building } from "lucide-react";
import { ArrowLeft, Check } from "lucide-react";

const UserTypeSelection = () => {
  const { setUserType } = React.useContext(FormContext);
  const navigate = useNavigate();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Employee Survey Portal
        </h1>
        <div className="space-y-4">
          {[
            { type: "coordinator", label: "Coordinator", icon: Building },
            { type: "grouphead", label: "Group Head", icon: Users },
            { type: "employee", label: "General Employee", icon: User },
          ].map(({ type, label, icon: Icon }) => (
            <div
              key={type}
              onClick={() => handleUserTypeSelect(type)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-800">
                    {label}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UserTypeSelection;
