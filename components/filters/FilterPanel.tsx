"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  filters: {
    [key: string]: {
      label: string;
      options: FilterOption[];
    };
  };
  onFilterChange: (filters: { [key: string]: string }) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value === "") {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAll = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const activeCount = Object.keys(activeFilters).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Filter className="h-5 w-5" />
        <span>Filtros</span>
        {activeCount > 0 && (
          <span className="px-2 py-0.5 bg-blue-kings text-white text-xs rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Filtros</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(filters).map(([key, filter]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {filter.label}
                  </label>
                  <select
                    value={activeFilters[key] || ""}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Todos</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {activeCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

