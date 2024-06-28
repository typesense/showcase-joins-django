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
import { typesenseServer } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { InstantSearch } from "react-instantsearch";
import { Hit } from "instantsearch.js";
import { Link } from "react-router-dom";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";

const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
  server: typesenseServer,
  additionalSearchParameters: {
    query_by: "name, country, ref",
    sort_by:
      "_eval([ (name:Monaco):5, (name:Monza):4, (name:Adelaide):3, (name:Enzo Ferrari):2 ]):desc",
  },
});

export type Circuit = {
  id: string;
  ref: string;
  name: string;
  country: string;
};

const columnDefs: ColumnDef<Hit<Circuit>>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link to={`/circuits/${row.original.id}`}>
          <Highlight
            hit={row.original}
            attribute="name"
            classNames={{ highlighted: "bg-red-500 text-red-50 p-0.5" }}
          />{" "}
          <span className="text-muted-foreground">
            (
            {row.original.ref
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            )
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => {
      return (
        <Highlight
          hit={row.original}
          attribute="country"
          classNames={{ highlighted: "bg-red-500 text-red-50 p-0.5" }}
        />
      );
    },
  },
];

export default function Circuit() {
  return (
    <div className="flex flex-col w-full  items-center h-full">
      <Card className="w-full min-h-full">
        <CardHeader className="sticky top-0 bg-background rounded-lg z-10">
          <CardTitle>Circuit</CardTitle>
          <CardDescription>Where the magic happens.</CardDescription>
        </CardHeader>
        <CardContent className="max-h-5/7">
          <InstantSearch
            searchClient={typesenseInstantsearchAdapter.searchClient}
            indexName="circuit"
          >
            <CustomHitsPerPage
              items={[
                { label: "10 per page", value: 10, default: true },
                { label: "50 per page", value: 50 },
              ]}
            />
            <SearchBox />
            <InfiniteHitsTable columns={columnDefs} />
          </InstantSearch>
        </CardContent>
      </Card>
    </div>
  );
}
