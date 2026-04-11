/**
 * CascadingSelect - A component for hierarchical dropdown selections
 * Updates child options based on parent value selection
 */

import React from "react";

interface CascadingSelectProps {
  label: string;
  parentValue?: string;
  value?: string;
  onChange: (value: string) => void;
  options: readonly string[];
  disabled?: boolean;
  placeholder?: string;
  loading?: boolean;
}

/**
 * Renders a select dropdown with cascading options support
 * @param label - Label for the select field
 * @param parentValue - Parent value that determines available options
 * @param value - Currently selected value
 * @param onChange - Callback when selection changes
 * @param options - Array of available options
 * @param disabled - Whether the select is disabled
 * @param placeholder - Placeholder text when no value is selected
 * @param loading - Whether options are loading
 */
export function CascadingSelect({
  label,
  parentValue,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Select an option",
  loading = false,
}: CascadingSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value || ""}
        onChange={handleChange}
        disabled={disabled || loading || options.length === 0}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {!value && <option value="">{placeholder}</option>}
        {loading ? (
          <option value="" disabled>Loading...</option>
        ) : (
          options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))
        )}
      </select>
      {loading && (
        <p className="text-xs text-gray-500">Loading options...</p>
      )}
    </div>
  );
}
