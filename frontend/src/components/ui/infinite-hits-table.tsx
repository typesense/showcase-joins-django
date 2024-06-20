import { type ColumnDef } from "@tanstack/react-table";
import { BaseHit } from "instantsearch.js";
import { useInfiniteHits } from "react-instantsearch";
import { DataTable } from "./data-table";
import { Button } from "./button";

export function InfiniteHitsTable<T extends BaseHit, TValue>({
  columns,
  className,
}: {
  columns: ColumnDef<T, TValue>[];
  className?: string;
}) {
  const { items, showMore, isLastPage } = useInfiniteHits<T>();

  return (
    <div className="[&_tr:has([data-winner=yes])]:bg-gradient-to-tl from-yellow-50 to-yellow-100 [&_tr:has([data-winner=yes])]:border-yellow-300 ">
      <DataTable columns={columns} data={items} className={className} />
      <Button
        variant="ghost"
        onClick={showMore}
        disabled={isLastPage}
        className="font-semibold"
      >
        Show More
      </Button>
    </div>
  );
}
