import { useMemo, useState } from "react";

export default function usePagination(data = [], pageSize = 7) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginated = useMemo(() => {
    return data.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [data, currentPage, pageSize]);

  const nextPage = () =>
    setCurrentPage((page) => Math.min(totalPages, page + 1));

  const prevPage = () =>
    setCurrentPage((page) => Math.max(1, page - 1));

  return {
    paginated,
    currentPage,
    totalPages,
    setCurrentPage,
    nextPage,
    prevPage,
  };
}