import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function QRPagination({ page, totalPages, onChange }: Props) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>

      <span className="flex items-center px-3">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
