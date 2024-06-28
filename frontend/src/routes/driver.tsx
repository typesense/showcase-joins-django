import { CustomHitsPerPage } from "@/components/instantsearch/hits-per-page";
import { SearchBox } from "@/components/instantsearch/search-box";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Highlight } from "react-instantsearch";
import { InfiniteHitsTable } from "@/components/ui/infinite-hits-table";
import { typesenseInstantsearchAdapter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { InstantSearch } from "react-instantsearch";
import { Hit } from "instantsearch.js";
import { Link } from "react-router-dom";

export type Driver = {
  id: string;
  forename: string;
  surname: string;
  number: number;
  dob: number;
  nationality: string;
};
const columnDefs: ColumnDef<Hit<Driver>>[] = [
  {
    accessorKey: "forename",
    header: "Forename",
    cell: ({ row }) => {
      return (
        <Link to={`/drivers/${row.original.id}`}>
          <Highlight
            hit={row.original}
            attribute="forename"
            classNames={{ highlighted: "bg-red-500 text-red-50 p-0.5" }}
          />
        </Link>
      );
    },
  },
  {
    accessorKey: "surname",
    header: "Surname",
    cell: ({ row }) => {
      return (
        <Link to={`/drivers/${row.original.id}`}>
          <Highlight
            hit={row.original}
            attribute="surname"
            classNames={{ highlighted: "bg-red-500 text-red-50 p-0.5" }}
          />
        </Link>
      );
    },
  },
  {
    accessorKey: "number",
    header: () => "Number",
  },
  {
    accessorKey: "nationality",
    meta: { className: "hidden lg:table-cell" },
    header: () => "Nationality",
  },
];

export default function Driver() {
  return (
    <div className="flex flex-col w-full  items-center h-full">
      <Card className="w-full min-h-full">
        <CardHeader className="sticky top-12 lg:top-0 bg-background rounded-lg z-10 ">
          <CardTitle>Drivers</CardTitle>
          <CardDescription>
            Search through F1's legendary catalogue of drivers over the years.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-5/7">
          <InstantSearch
            searchClient={typesenseInstantsearchAdapter.searchClient}
            indexName="driver"
          >
            <CustomHitsPerPage
              items={[
                { label: "10 per page", value: 10, default: true },
                { label: "50 per page", value: 50 },
              ]}
            />
            <SearchBox />
            <InfiniteHitsTable
              columns={columnDefs}
              className="sticky top-40 lg:top-20  rounded-md bg-background border-b"
            />
          </InstantSearch>
        </CardContent>
      </Card>
    </div>
  );
}
