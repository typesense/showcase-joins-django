import { SearchBox } from "@/components/instantsearch/search-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { typesenseClient, typesenseServer } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch";
import { useParams } from "react-router-dom";
import { InfiniteHitsTable } from "@/components/ui/infinite-hits-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Trophy } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Hit } from "instantsearch.js";
import { Highlight } from "react-instantsearch";
import { CustomHitsPerPage } from "@/components/instantsearch/hits-per-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { MultiFilter } from "@/components/instantsearch/filter";
import { SortBy } from "@/components/instantsearch/sort-by";
import type { Team } from "@/routes/team";
import { CurrentRefinements } from "@/components/instantsearch/current-refinements";

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

type TeamStanding = {
  points: number;
  position: number;
  positionText: string;
  wins: number;
};

type Result = {
  points: number;
};

type Race = {
  id: string;
  name: string;
  date: number;
  year: number;
  round: number;
  circuit_id: string;
  teamresult: Result;
  teamstanding: TeamStanding;
};

const seasonColumns: ColumnDef<Hit<Race>>[] = [
  {
    accessorKey: "year",
    header: () => "Year",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => {
      return <Highlight hit={row.original} attribute="year" />;
    },
  },
  {
    accessorKey: "standing.position",
    header: () => "Position",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) =>
      row.original.teamstanding.position === 1 ? (
        <div className="flex gap-1 items-center rounded-md" data-winner="yes">
          <span>{row.original.teamstanding.position}</span>
          <Trophy className="h-4 w-4"></Trophy>
        </div>
      ) : (
        <span data-winner="no">{row.original.teamstanding.position}</span>
      ),
  },
  {
    accessorKey: "standing.wins",
    header: () => "Wins",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => {
      return <span>{row.original.teamstanding.wins}</span>;
    },
  },
  {
    accessorKey: "standing.points",
    header: () => "Points",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => `${row.original.teamstanding.points}`,
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
    meta: { className: "hidden lg:table-cell" },
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
    accessorKey: "result.points",
    header: () => "Points",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => {
      return (
        <div className=" gap-1 items-center hidden lg:flex">
          <span>{row.original.teamresult.points}</span>
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
];

export default function TeamDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [teamDetails, setTeamDetails] = useState<Team>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchTeam() {
      if (!id) {
        return <div>Not found</div>;
      }
      if (!Number(id)) {
        navigate("not-found");
      }

      try {
        const fetchedTeam = await typesenseClient
          .collections<Team>("team")
          .documents(String(id))
          .retrieve();

        setTeamDetails(fetchedTeam);
      } catch (error) {
        console.error("Error fetching team details:", error);
        if (error instanceof Error) {
          console.log("Error name:", error.name);
          console.log("Error message:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeam();
  }, [id, navigate]);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!teamDetails) {
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
              <CardTitle>{`${teamDetails.name}'s Races`}</CardTitle>
            </CardHeader>
            <CardContent className="max-h-5/7">
              <InstantSearch
                searchClient={raceConfig.searchClient}
                indexName="race"
                future={{ preserveSharedStateOnUnmount: true }}
              >
                <Configure filters={`$teamresult(team_id:${teamDetails.id})`} />
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
                      { attribute: "year" },
                      { attribute: "round" },
                      { attribute: "name" },
                    ]}
                  />
                  <SortBy
                    items={[
                      { label: "Relevance", value: "race" },
                      { label: "Year Ascending", value: "race/sort/year:asc" },
                      {
                        label: "Points Ascending",
                        value: "race/sort/$teamresult(points:asc)",
                      },
                      {
                        label: "Points Descending",
                        value: "race/sort/$teamresult(points:desc)",
                      },
                    ]}
                  />
                </div>
                <SearchBox />
                <InfiniteHitsTable columns={raceColumns} />
              </InstantSearch>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seasons">
          <Card className="w-full min-h-full ">
            <CardHeader className="sticky top-0 bg-background rounded-lg z-50">
              <CardTitle>{`${teamDetails.name}'s Seasons`}</CardTitle>
            </CardHeader>
            <CardContent className="max-h-5/7">
              <InstantSearch
                searchClient={seasonConfig.searchClient}
                future={{ preserveSharedStateOnUnmount: true }}
                indexName="race"
              >
                <Configure
                  filters={`$teamstanding(team_id:${teamDetails.id})`}
                />
                <div className="flex gap-2 items-end">
                  <CustomHitsPerPage
                    items={[
                      { label: "10 per page", value: 10, default: true },
                      { label: "50 per page", value: 50 },
                    ]}
                  />
                  <SortBy
                    items={[
                      { label: "Relevance", value: "race" },
                      { label: "Year Ascending", value: "race/sort/year:asc" },
                      {
                        label: "Year Descending",
                        value: "race/sort/year:desc",
                      },
                    ]}
                  />
                </div>
                <SearchBox />
                <InfiniteHitsTable columns={seasonColumns} />
              </InstantSearch>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
