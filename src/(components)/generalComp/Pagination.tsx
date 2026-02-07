import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
}: {
  pagination: PaginationProps;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (pagination.totalPages <= maxVisible) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, pagination.currentPage - 1);
      let end = Math.min(pagination.totalPages - 1, pagination.currentPage + 1);

      if (pagination.currentPage <= 3) {
        end = 4;
      }

      if (pagination.currentPage >= pagination.totalPages - 2) {
        start = pagination.totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < pagination.totalPages - 1) {
        pages.push("...");
      }

      pages.push(pagination.totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-300/90 px-4 m-4 rounded-lg">
      Showing:{" "}
      <div className="text-sm text-gray-600">
        Showing{" "}
        {Math.min(
          (pagination.currentPage - 1) * pagination.limit + 1,
          pagination.totalCount,
        )}{" "}
        to{" "}
        {Math.min(
          pagination.currentPage * pagination.limit,
          pagination.totalCount,
        )}{" "}
        of {pagination.totalCount} results
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() => onPageChange(1)}
          className="min-w-10 btn rounded-lg border transition-colors bg-white"
          disabled={!pagination?.hasPrevPage}
        >
          <FaAngleDoubleLeft size={14} />
        </button>
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          className="min-w-10 btn rounded-lg border transition-colors bg-white"
          disabled={!pagination?.hasPrevPage}
        >
          <FaAngleLeft size={14} />
        </button>
        <div className="md:flex hidden p-2">
          {pageNumbers.map((page, index) => (
            <button
              className={`min-w-10 btn px-3 py-2 rounded-lg border transition-colors ${
                page === pagination.currentPage
                  ? "bg-blue-500 text-white border-blue-500"
                  : page === "..."
                    ? "cursor-default bg-white border-transparent"
                    : "bg-white hover:bg-gray-50"
              }`}
              disabled={page === "..."}
              onClick={() => typeof page === "number" && onPageChange(page)}
              key={index}
            >
              {page}
            </button>
          ))}
        </div>
        <div className="flex md:hidden">
          <select
            className="flex bg-white p-2 m-2 items-center justify-center rounded-lg"
            onChange={(e) => onPageChange(Number(e.target.value))}
            name="page"
            id="page"
          >
            {pageNumbers.map((page, index) => (
              <option key={index} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          className="min-w-10 btn rounded-lg border transition-colors bg-white"
          disabled={!pagination?.hasNextPage}
        >
          <FaAngleRight size={14} />
        </button>
        <button
          onClick={() => onPageChange(pagination.totalPages)}
          className="min-w-10 btn rounded-lg border transition-colors bg-white"
          disabled={!pagination?.hasNextPage}
        >
          <FaAngleDoubleRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
