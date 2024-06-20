import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isRouteErrorResponse } from "react-router-dom";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function errorMessage(error: unknown): string {
  switch (true) {
    case isRouteErrorResponse(error):
      return `${error.status}: ${error.statusText}`;
    case error instanceof Error:
      return error.message;
    case typeof error === "string":
      return error;
    default:
      console.error(error);
      return "Unknown error";
  }
}
