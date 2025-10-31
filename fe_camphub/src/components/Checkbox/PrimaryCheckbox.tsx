"use client";

import React from "react";

interface PrimaryCheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

const PrimaryCheckbox: React.FC<PrimaryCheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label = "",
}) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer hover:bg-white/10"
      />

      {label !== "" && (
        <label htmlFor={id} className="ml-2 block text-md text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};

export default PrimaryCheckbox;
