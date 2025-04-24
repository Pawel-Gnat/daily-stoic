import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationEllipsis,
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
  console.log(page, total);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.history.pushState({}, "", `/entries?page=${page}`);
  };

  return (
    <PaginationUI>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {page < total && (
          <PaginationItem className="cursor-pointer">
            <PaginationNext onClick={() => handlePageChange(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationUI>
  );
};
