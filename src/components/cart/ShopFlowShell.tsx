import Link from "next/link";
import { ChevronRight } from "lucide-react";
export type ShopCrumb = { label: string; href?: string };

type Props = {
  title: string;
  description?: string;
  crumbs: ShopCrumb[];
  maxWidth?: "lg" | "3xl";
  centered?: boolean;
  children: React.ReactNode;
};

export default function ShopFlowShell({
  title,
  description,
  crumbs,
  maxWidth = "3xl",
  centered = false,
  children,
}: Props) {
  const widthClass = maxWidth === "lg" ? "max-w-lg" : "max-w-3xl";

  return (
    <div
      className={`page-container py-8 sm:py-10 ${
        centered ? "flex flex-col items-center justify-center text-center" : ""
      }`}
    >
      <div className={`mx-auto w-full ${widthClass}`}>
        <nav
          className={`mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground ${
            centered
              ? "justify-center text-center"
              : "justify-center text-center sm:justify-start sm:text-left"
          }`}
          aria-label="Kelionė"
        >
          {crumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="contents">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
              )}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <header className={`mb-8 ${centered ? "text-center" : "text-center sm:text-left"}`}>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>

        {children}
      </div>
    </div>
  );
}
