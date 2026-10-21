import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  nextPage,
  prevPage,
}) {

  return (
    <nav
      aria-label="Applications pages"
      className="flex items-center justify-center gap-1 pt-2"
    >
      <button
        type="button"
        onClick={prevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0bbcaa] hover:text-brand-strong disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-brand-strong text-white"
              : "border border-gray-200 text-gray-600 hover:border-[#0bbcaa] hover:text-brand-strong"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={nextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0bbcaa] hover:text-brand-strong disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
