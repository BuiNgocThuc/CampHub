"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PrimaryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PrimaryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PrimaryPaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Trang trước"
      >
        <ChevronLeft size={20} className="text-gray-600" />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg border font-medium transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            aria-label={`Trang ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Trang sau"
      >
        <ChevronRight size={20} className="text-gray-600" />
      </button>

      <span className="ml-4 text-sm text-gray-600">
        Trang {currentPage} / {totalPages}
      </span>
    </div>
  );
}

