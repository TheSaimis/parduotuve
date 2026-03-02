import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
  }).format(num);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
