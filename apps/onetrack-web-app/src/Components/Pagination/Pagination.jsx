import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  nextPage,
  prevPage,
}) {

  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <button
        onClick={prevPage}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0bbcaa] hover:text-[#0bbcaa] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-[#0bbcaa] text-white"
              : "border border-gray-200 text-gray-600 hover:border-[#0bbcaa] hover:text-[#0bbcaa]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={nextPage}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0bbcaa] hover:text-[#0bbcaa] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Pagination;