import { SearchBox } from "@/components/instantsearch/search-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfiniteHitsTable } from "@/components/ui/infinite-hits-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { typesenseClient, typesenseServer } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Hit } from "instantsearch.js";
import { HelpCircle, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Configure, Highlight, InstantSearch } from "react-instantsearch";
import { useNavigate, useParams } from "react-router-dom";
import type { Driver } from "./driver";

import { CurrentRefinements } from "@/components/instantsearch/current-refinements";
import { MultiFilter } from "@/components/instantsearch/filter";
import { CustomHitsPerPage } from "@/components/instantsearch/hits-per-page";
import { SortBy } from "@/components/instantsearch/sort-by";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";

const seasonConfig = new TypesenseInstantsearchAdapter({
  server: typesenseServer,
  additionalSearchParameters: {
    query_by: "name",
    sort_by: "date:desc",
    group_by: "year",
    group_limit: 1,
  },
});

const raceConfig = new TypesenseInstantsearchAdapter({
  server: typesenseServer,
  additionalSearchParameters: {
    query_by: "name",
    sort_by: "date:desc",
  },
});

type DriverStanding = {
  points: number;
  position: number;
  positionText: string;
  wins: number;
};

type Result = {
  teamId: string;
  fastestLap: number;
  grid: number;
  position: number;
  rank: number;
  time: string;
  points: number;
};

type Race = {
  id: string;
  name: string;
  date: number;
  year: number;
  round: number;
  result: Result;
  driverstanding: DriverStanding;
};

const seasonColumns: ColumnDef<Hit<Race>>[] = [
  {
    accessorKey: "year",
    header: () => "Year",
    cell: ({ row }) => {
      return <Highlight hit={row.original} attribute="year" />;
    },
  },
  {
    accessorKey: "standing.position",
    header: () => "Position",
    cell: ({ row }) =>
      row.original.driverstanding.position === 1 ? (
        <div className="flex gap-1 items-center rounded-md" data-winner="yes">
          <span>{row.original.driverstanding.position}</span>
          <Trophy className="h-4 w-4"></Trophy>
        </div>
      ) : (
        <span data-winner="no">{row.original.driverstanding.position}</span>
      ),
  },
  {
    accessorKey: "standing.wins",
    header: () => "Wins",
    cell: ({ row }) => {
      return <span>{row.original.driverstanding.wins}</span>;
    },
  },
  {
    accessorKey: "standing.points",
    header: () => "Points",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => {
      return <span>{row.original.driverstanding.points}</span>;
    },
  },
];

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
    accessorKey: "result.grid",
    meta: { className: "hidden lg:flex items-center" },
    header: () => "Grid Position",
    cell: ({ row }) => {
      return (
        <span className="hidden lg:block">{row.original.result.grid}</span>
      );
    },
  },
  {
    accessorKey: "result.position",
    header: () => "Result",
    cell: ({ row }) => {
      const val = row.original.result.position;

      if (!val) {
        return <span className="text-muted-foreground">DNF/DQ</span>;
      }

      return val === 1 ? (
        <div className="flex gap-1 items-center" data-winner="yes">
          <span>{val}</span>
          <Trophy className="h-4 w-4"></Trophy>
        </div>
      ) : (
        <span data-winner="no">{val}</span>
      );
    },
  },
  {
    accessorKey: "result.points",
    header: () => "Points",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => {
      return (
        <div className=" gap-1 items-center flex">
          <span>{row.original.result.points}</span>
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="w-[200px]">
                <p>
                  The point system has changed much over the years. To get a
                  better idea of how points are awarded to drivers, check out
                  the
                </p>
                <a
                  className="text-blue-500 underline"
                  href="https://simple.wikipedia.org/wiki/List_of_Formula_One_World_Championship_points_scoring_systems"
                >
                  Wikipedia Entry
                </a>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "result.time",
    meta: { className: "hidden lg:table-cell" },
    header: () => "Time (Relative to Winner)",
    cell: ({ row }) => {
      return (
        <span className="hidden lg:block">{row.original.result.time}</span>
      );
    },
  },
];

export default function DriverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driverDetails, setDriverDetails] = useState<Driver>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchDriver() {
      if (!id) {
        navigate("not-found");
      }
      if (!Number(id)) {
        navigate("not-found");
      }

      try {
        const fetchedDriver = await typesenseClient
          .collections<Driver>("driver")
          .documents(id!)
          .retrieve();

        setDriverDetails(fetchedDriver);
      } catch (error) {
        console.error("Error fetching driver details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDriver();
  }, [id, navigate]);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!driverDetails) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex flex-col w-full  items-center h-full">
      <Tabs className="w-full" defaultValue="races">
        <TabsList>
          <TabsTrigger value="races">Races</TabsTrigger>
          <TabsTrigger value="seasons">Seasons</TabsTrigger>
        </TabsList>
        <TabsContent value="races">
          <Card className="w-full min-h-full ">
            <CardHeader className="sticky top-12 lg:top-0 bg-background rounded-lg z-10">
              <CardTitle>{`${driverDetails.forename} ${driverDetails.surname}'s Races`}</CardTitle>
            </CardHeader>
            <CardContent className="max-h-5/7 ">
              <InstantSearch
                searchClient={raceConfig.searchClient}
                indexName="race"
                future={{ preserveSharedStateOnUnmount: true }}
              >
                <Configure filters={`$result(driver_id:${driverDetails.id})`} />{" "}
                <CurrentRefinements />
                <div className="flex gap-2 items-end">
                  <CustomHitsPerPage
                    items={[
                      { label: "10 per page", value: 10, default: true },
                      { label: "50 per page", value: 50 },
                    ]}
                  />
                  <MultiFilter
                    props={[
                      {
                        attribute: "year",
                        showMoreLimit: 25,
                      },
                      { attribute: "round" },
                      { attribute: "name" },
                    ]}
                  />
                  <SortBy
                    items={[
                      { label: "Relevance", value: "race" },
                      {
                        label: "Year Ascending",
                        value: "race/sort/year:asc",
                      },
                      {
                        label: "Grid Ascending",
                        value: "race/sort/$result(grid:asc)",
                      },
                      {
                        label: "Grid Descending",
                        value: "race/sort/$result(grid:desc)",
                      },
                      {
                        label: "Position Ascending",
                        value: "race/sort/$result(position:asc)",
                      },
                      {
                        label: "Position Descending",
                        value: "race/sort/$result(position:desc)",
                      },
                    ]}
                  />
                </div>
                <SearchBox />
                <InfiniteHitsTable
                  columns={raceColumns}
                  className="sticky  top-28 lg:top-16  rounded-md bg-background border-b"
                />
              </InstantSearch>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seasons">
          <Card className="w-full min-h-full ">
            <CardHeader className="sticky top-12 lg:top-0 bg-background rounded-lg z-10">
              <CardTitle>{`${driverDetails.forename} ${driverDetails.surname}'s Seasons`}</CardTitle>
            </CardHeader>
            <CardContent className="max-h-5/7">
              <InstantSearch
                searchClient={seasonConfig.searchClient}
                future={{ preserveSharedStateOnUnmount: true }}
                indexName="race"
              >
                <Configure
                  filters={`$driverstanding(driver_id:${driverDetails.id})`}
                />
                <CustomHitsPerPage
                  items={[
                    { label: "10 per page", value: 10, default: true },
                    { label: "50 per page", value: 50 },
                  ]}
                />
                <SearchBox />
                <InfiniteHitsTable
                  columns={seasonColumns}
                  className="sticky  top-28 lg:top-16  rounded-md bg-background border-b"
                />
              </InstantSearch>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
