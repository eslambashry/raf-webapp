'use client'
import { ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage = 1, totalPages = 5, onPageChange }: PaginationProps) {
  if (totalPages <= 0) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => totalPages - index);

  return (
    <div className="flex justify-center my-16">
      <div className="relative flex items-center h-20 border border-[#34222e] rounded-[5px] bg-white">
        {/* Left Navigation Button */}
        {/* <button 
          className="flex items-center justify-center w-20 h-full border-l border-[#34222e] relative group"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <div className="flex gap-1">
            <ChevronRight className="w-6 h-6 text-[#34222e] rotate-180" />
            <ChevronRight className="w-6 h-6 text-[#34222e] rotate-180" />
            <ChevronRight className="w-6 h-6 text-[#34222e] rotate-180" />
          </div>
        </button> */}

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`relative w-[92px] h-full text-[30px] font-bold font-cairo text-[#34222e] border-l border-[#34222e] transition-colors
              ${currentPage === pageNumber ? 'bg-[#34222e]/5' : 'hover:bg-[#34222e]/5'}`}
          >
            {pageNumber}
          </button>
        ))}

        {/* Right Navigation Button */}
        {/* <button 
          className="flex items-center justify-center w-20 h-full border-l border-[#34222e] relative group"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <div className="flex gap-1">
            <ChevronRight className="w-6 h-6 text-[#34222e]" />
            <ChevronRight className="w-6 h-6 text-[#34222e]" />
            <ChevronRight className="w-6 h-6 text-[#34222e]" />
          </div>
        </button> */}
      </div>
    </div>
  )
}
