import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const separator = basePath.includes("?") ? "&" : "?";

  function href(page: number) {
    return page === 1 ? basePath : `${basePath}${separator}page=${page}`;
  }

  return (
    <nav
      aria-label="Puslapiavimas"
      className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-muted/30 text-muted-foreground transition-all hover:border-primary/40 hover:bg-muted/60 hover:text-foreground sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 text-muted-foreground/30 sm:h-10 sm:w-10">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground sm:h-10 sm:w-10"
          >
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold transition-all sm:h-10 sm:w-10 ${
              p === currentPage
                ? "border-primary bg-gradient-to-br from-primary to-sky-600 text-white shadow-md shadow-primary/25"
                : "border-border/80 bg-muted/30 text-muted-foreground hover:border-primary/35 hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-muted/30 text-muted-foreground transition-all hover:border-primary/40 hover:bg-muted/60 hover:text-foreground sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 text-muted-foreground/30 sm:h-10 sm:w-10">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
