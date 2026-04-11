/**
 * ShoeSizeStockInput - Component for shoe-specific size quantity inputs
 * Shows numeric input fields for EU sizes 35-46
 * Validates at least one size has quantity > 0
 * Shows total stock count
 */

import React from "react";

interface ShoeSizeStockInputProps {
  values: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
  error?: string;
}

const SHOE_SIZES = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

/**
 * Renders a grid of size quantity inputs for shoes
 * @param values - Object mapping size to quantity (e.g., { "35": 5, "36": 3 })
 * @param onChange - Callback when quantity values change
 * @param error - Validation error message to display
 */
export function ShoeSizeStockInput({ values, onChange, error }: ShoeSizeStockInputProps) {
  const handleQuantityChange = (size: string, quantity: number) => {
    const newValues = { ...values, [size]: Math.max(0, quantity) };
    onChange(newValues);
  };

  const totalStock = Object.values(values).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shoe Sizes with Quantity <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Enter quantity for each size. At least one size must have stock.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {SHOE_SIZES.map((size) => (
          <div key={size} className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">
              Size {size}
            </label>
            <input
              type="number"
              min="0"
              value={values[size] || 0}
              onChange={(e) => handleQuantityChange(size, parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-700">Total Stock:</span>
        <span className="text-sm font-bold text-blue-600">{totalStock} units</span>
      </div>
    </div>
  );
}
