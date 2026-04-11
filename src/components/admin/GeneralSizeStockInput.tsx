/**
 * GeneralSizeStockInput - Component for general size stock inputs
 * Used for bags, accessories, and other non-shoe products
 * Supports labeled sizes (S/M/L/XL, One Size) with single quantity
 */

import React from "react";

interface GeneralSizeStockInputProps {
  sizeSystem: "bag" | "general";
  selectedSize?: string;
  quantity: number;
  onSizeChange: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
  error?: string;
}

const SIZE_OPTIONS = {
  bag: [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "xl", label: "Extra Large" },
  ],
  general: [
    { value: "one-size", label: "One Size" },
    { value: "s", label: "Small" },
    { value: "m", label: "Medium" },
    { value: "l", label: "Large" },
    { value: "xl", label: "Extra Large" },
  ],
};

/**
 * Renders size selection dropdown and quantity input for non-shoe products
 * @param sizeSystem - Either 'bag' or 'general' size system
 * @param selectedSize - Currently selected size value
 * @param quantity - Current quantity
 * @param onSizeChange - Callback when size selection changes
 * @param onQuantityChange - Callback when quantity changes
 * @param error - Validation error message to display
 */
export function GeneralSizeStockInput({
  sizeSystem,
  selectedSize,
  quantity,
  onSizeChange,
  onQuantityChange,
  error,
}: GeneralSizeStockInputProps) {
  const options = SIZE_OPTIONS[sizeSystem];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Size <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedSize || ""}
            onChange={(e) => onSizeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {!selectedSize && <option value="">Select size</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={quantity || 0}
            onChange={(e) => onQuantityChange(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {selectedSize && quantity > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Total Stock:</span>
          <span className="text-sm font-bold text-blue-600">{quantity} units</span>
        </div>
      )}
    </div>
  );
}
