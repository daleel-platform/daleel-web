import { Button } from '@/components/button';
import type { PaginationMeta } from '../types/mentor.types';

export interface MentorPaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function MentorPagination({
  meta,
  onPageChange,
}: MentorPaginationProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-200/80 pt-5">
      <span className="text-xs font-medium text-slate-500">
        Page <strong className="text-slate-800">{meta.currentPage}</strong> of{' '}
        <strong className="text-slate-800">{meta.totalPages}</strong>
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, meta.currentPage - 1))}
          disabled={!meta.hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange(Math.min(meta.totalPages, meta.currentPage + 1))
          }
          disabled={!meta.hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
