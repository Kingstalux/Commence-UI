import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString()} FCFA`;
  // return new Intl.NumberFormat("fr-FR", {
  //   style: "currency",
  //   currency: "XAF",
  //   minimumFractionDigits: 0,
  //   maximumFractionDigits: 0,
  // })
  //   .format(amount)
  //   .toLocaleString()
  //   .replace("$", "FCFA");
}
