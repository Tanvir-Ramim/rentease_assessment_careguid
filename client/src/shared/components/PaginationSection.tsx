interface PaginationSectionProps {
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
  totalPage: number;
}

const PaginationSection = ({ page, setPage, totalPage }: PaginationSectionProps) => {
  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`
            @lg:px-2.5 px-1 @sm:py-1 py-0.5
            p-0.5 flex items-center @lg:text-base cursor-pointer text-xs justify-center rounded
            transition-all duration-200 ease-in-out
            ${page === i ? "text-black border" : ""}
          `}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="mt-6 lg:mb-8 md:mb-7 sm:6 mb-4 md:mr-9 flex items-center @lg:space-x-3 space-x-2 text-[#464255] font-medium md:justify-end justify-center">
      <button
        disabled={page === 1}
        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
        className="flex items-center @lg:text-base text-sm pr-2 cursor-pointer gap-1 hover:text-black disabled:opacity-40"
      >
        <span className="text-lg">←</span> Previous
      </button>

      {renderPages()}

      <button
        disabled={page === totalPage}
        onClick={() => setPage((p: number) => Math.min(totalPage, p + 1))}
        className="flex items-center gap-1 pl-2 cursor-pointer @lg:text-base text-sm hover:text-black disabled:opacity-40"
      >
        Next <span className="text-lg">→</span>
      </button>
    </div>
  );
};

export default PaginationSection;