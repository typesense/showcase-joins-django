import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isRouteErrorResponse } from "react-router-dom";
import Typesense from "typesense";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

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

export const typesenseServer = {
  apiKey: import.meta.env.VITE_TYPESENSE_READ_ONLY_API_KEY || "xyz",
  nodes: [
    {
      host: import.meta.env.VITE_PUBLIC_TYPESENSE_HOST || "localhost",
      port: import.meta.env.VITE_PUBLIC_TYPESENSE_PORT || 8108,
      protocol: import.meta.env.VITE_PUBLIC_TYPESENSE_PROTOCOL || "http",
    },
  ],
};

export const typesenseClient = new Typesense.Client(typesenseServer);

export const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: typesenseServer,
  additionalSearchParameters: {
    query_by: "surname,forename,nationality",
    num_typos: 1,
    split_join_tokens: "always",
    sort_by:
      "_eval([ (code:HAM):5, (code:VER && forename:Max):4, (code:ALO):3, (code:VET):2 ]):desc, dob:desc",
  },
});
