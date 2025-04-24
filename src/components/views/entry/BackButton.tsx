"use client";
import React from "react";
import { useNavigate } from "@/hooks/useNavigate";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/entries");
  };

  return (
    <button onClick={handleClick} className="bg-gray-200 px-4 py-2 rounded mb-4">
      Back
    </button>
  );
};

export default BackButton;
