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
    query_by: "name, nationality, ref",
    sort_by:
      "_eval([ (name:Mclaren):5, (name:Ferrari):4, (name:Red Bull):3, (name:Mercedes):2 ]):desc",
  },
});

export type Team = {
  id: string;
  ref: string;
  name: string;
  nationality: string;
};

const columnDefs: ColumnDef<Hit<Team>>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link to={`/teams/${row.original.id}`}>
          <Highlight
            hit={row.original}
            attribute="name"
            classNames={{ highlighted: "bg-red-500 text-red-50 p-0.5" }}
          />
        </Link>
      );
    },
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
    cell: ({ row }) => {
      return (
        <Highlight
          hit={row.original}
          attribute="nationality"
          classNames={{ highlighted: "bg-red-500 text-red-50 p-0.5" }}
        />
      );
    },
  },
];

export default function Team() {
  return (
    <div className="flex flex-col w-full  items-center h-full">
      <Card className="w-full min-h-full">
        <CardHeader className="sticky top-0 bg-background rounded-lg z-10">
          <CardTitle>Teams</CardTitle>
          <CardDescription>The ones that made it happen.</CardDescription>
        </CardHeader>
        <CardContent className="max-h-5/7">
          <InstantSearch
            searchClient={typesenseInstantsearchAdapter.searchClient}
            indexName="team"
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
