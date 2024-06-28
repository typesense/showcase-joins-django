import { SearchBox } from "@/components/instantsearch/search-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { typesenseClient, typesenseServer } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch";
import { useParams } from "react-router-dom";
import { InfiniteHitsTable } from "@/components/ui/infinite-hits-table";
import { ColumnDef } from "@tanstack/react-table";
import { Hit } from "instantsearch.js";
import { Highlight } from "react-instantsearch";
import { CustomHitsPerPage } from "@/components/instantsearch/hits-per-page";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { MultiFilter } from "@/components/instantsearch/filter";
import { SortBy } from "@/components/instantsearch/sort-by";
import { Circuit } from "./circuit";
import { CurrentRefinements } from "@/components/instantsearch/current-refinements";

const raceConfig = new TypesenseInstantsearchAdapter({
  server: typesenseServer,
  additionalSearchParameters: {
    query_by: "name",
    sort_by: "date:desc",
  },
});

type Race = {
  id: string;
  name: string;
  date: number;
  year: number;
  round: number;
  circuit_id: string;
  url: string;
  fp1_date: string;
  fp1_time: string;
  fp2_date: string;
  fp2_time: string;
  fp3_date: string;
  fp3_time: string;
  quali_date: string;
  quali_time: string;
  sprint_date: string;
  sprint_time: string;
  time: string;
};

const raceColumns: ColumnDef<Hit<Race>>[] = [
  {
    accessorKey: "name",
    header: () => "Name",
    cell: ({ row }) => {
      return (
        <Highlight
          hit={row.original}
          attribute="name"
          classNames={{ highlighted: "bg-red-500 text-red-50 p-0.5" }}
        />
      );
    },
  },
  {
    accessorKey: "date",
    header: () => "Date",
    cell: ({ row }) => (
      <span>{format(new Date(row.original.date * 1000), "MMM do, yyyy")}</span>
    ),
  },
  {
    accessorKey: "year",
    header: () => "Year",
    cell: ({ row }) => {
      return (
        <Highlight
          hit={row.original}
          attribute="year"
          classNames={{ highlighted: "bg-red-500 text-red-50 p-0.5" }}
        />
      );
    },
  },
  {
    accessorKey: "round",
    header: () => "Round",
    cell: ({ row }) => {
      return (
        <Highlight
          hit={row.original}
          attribute="round"
          classNames={{ highlighted: "bg-red-500 text-red-50 p-0.5" }}
        />
      );
    },
  },
];

export default function CircuitDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [circuitDetails, setCircuitDetails] = useState<Circuit>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchCircuit() {
      if (!id) {
        navigate("not-found");
      }
      if (!Number(id)) {
        navigate("not-found");
      }

      try {
        const fetchedCircuit = await typesenseClient
          .collections<Circuit>("circuit")
          .documents(String(id))
          .retrieve();

        setCircuitDetails(fetchedCircuit);
      } catch (error) {
        console.error("Error fetching circuit details:", error);

        if (error instanceof Error) {
          console.log("Error name:", error.name);
          console.log("Error message:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCircuit();
  }, [id, navigate]);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!circuitDetails) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex flex-col w-full  items-center h-full">
      <Card className="w-full min-h-full ">
        <CardHeader className="sticky top-12 lg:top-0 bg-background rounded-lg z-10">
          <CardTitle>{`${circuitDetails.name}'s Races`}</CardTitle>
        </CardHeader>
        <CardContent className="max-h-5/7">
          <InstantSearch
            searchClient={raceConfig.searchClient}
            indexName="race"
            future={{ preserveSharedStateOnUnmount: true }}
          >
            <Configure filters={`circuit_id:${id}`} /> <CurrentRefinements />
            <div className="flex gap-2 items-end">
              <CustomHitsPerPage
                items={[
                  { label: "10 per page", value: 10, default: true },
                  { label: "50 per page", value: 50 },
                ]}
              />
              <MultiFilter
                props={[
                  { attribute: "year" },
                  { attribute: "round" },
                  { attribute: "name" },
                ]}
              />
              <SortBy
                items={[
                  { label: "Relevance", value: "race" },
                  { label: "Year Ascending", value: "race/sort/year:asc" },
                ]}
              />
            </div>
            <SearchBox />
            <InfiniteHitsTable columns={raceColumns} />
          </InstantSearch>
        </CardContent>
      </Card>
    </div>
  );
}
