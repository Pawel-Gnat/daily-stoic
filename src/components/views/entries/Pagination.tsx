import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, total, onPageChange }: PaginationProps) => {
  const pageNumbers = Array.from({ length: 4 }, (_, i) => page - 2 + i).filter((p) => p >= 1 && p <= total);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.history.pushState({}, "", `/entries?page=${page}`);
  };

  return (
    <PaginationUI>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
          </PaginationItem>
        )}

        {pageNumbers.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={p === page} onClick={() => handlePageChange(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {page < total && (
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationUI>
  );
};
