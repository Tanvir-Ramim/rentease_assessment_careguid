
interface PaginationSectionProps {
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
  totalPage: number;
}

const getPageNumbers = (page: number, totalPage: number) => {
  if (totalPage <= 5) {
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPage - 1, page + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPage - 1) pages.push("...");

  pages.push(totalPage);
  return pages;
};

const PaginationSection = ({ page, setPage, totalPage }: PaginationSectionProps) => {
  const renderPages = () =>
    getPageNumbers(page, totalPage).map((item, index) =>
      item === "..." ? (
        <span key={`dots-${index}`} className="px-1 text-[#464255]">
          ...
        </span>
      ) : (
        <button
          key={item}
          onClick={() => setPage(item)}
          className={`
            @lg:px-2.5 px-1 @sm:py-1 py-0.5
            p-0.5 flex items-center @lg:text-base cursor-pointer text-xs justify-center rounded
            transition-all duration-200 ease-in-out
            ${page === item ? "text-black border" : ""}
          `}
        >
          {item}
        </button>
      ),
    );

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