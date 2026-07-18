import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {

  if (totalPages <= 1) return null;

  const pages = [];

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    end = Math.min(5, totalPages);
  }

  if (currentPage >= totalPages - 2) {
    start = Math.max(1, totalPages - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-4
          py-2
          rounded-xl
          bg-slate-800
          text-white
          transition
          hover:bg-cyan-600
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >
        Previous
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="
              w-10
              h-10
              rounded-xl
              bg-slate-800
              text-white
              hover:bg-cyan-600
            "
          >
            1
          </button>

          {start > 2 && (
            <span className="text-slate-500 px-1">
              ...
            </span>
          )}
        </>
      )}

      {pages.map((page) => (

        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-10
            h-10
            rounded-xl
            transition
            ${
              page === currentPage
                ? "bg-cyan-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }
          `}
        >
          {page}
        </button>

      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="text-slate-500 px-1">
              ...
            </span>
          )}

          <button
            onClick={() => onPageChange(totalPages)}
            className="
              w-10
              h-10
              rounded-xl
              bg-slate-800
              text-white
              hover:bg-cyan-600
            "
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          px-4
          py-2
          rounded-xl
          bg-cyan-500
          text-white
          transition
          hover:bg-cyan-600
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >
        Next
      </button>

    </div>
  );
}