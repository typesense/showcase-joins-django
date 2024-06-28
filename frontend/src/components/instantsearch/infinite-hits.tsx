import * as React from "react";
import {
  Highlight,
  useInfiniteHits,
  type UseInfiniteHitsProps,
} from "react-instantsearch";
import type { BaseHit, Hit } from "instantsearch.js";
import { TableCell, TableHead, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export interface ColumnDef<T> {
  key: string;
  displayValue: (hit: T) => string;
}

interface CustomInfiniteHitsProps<T extends BaseHit>
  extends UseInfiniteHitsProps<T> {
  columnDefs: ColumnDef<T>[];
}

export function CustomInfiniteHits<T extends BaseHit>({
  columnDefs,
  ...props
}: CustomInfiniteHitsProps<T>) {
  const { items, showPrevious, showMore, isFirstPage, isLastPage } =
    useInfiniteHits(props);
  const map = React.useMemo(() => {
    return new Map(columnDefs.map((columnDef) => [columnDef.key, columnDef]));
  }, [columnDefs]);

  const getOrderedKeys = () => {
    return Array.from(map.keys());
  };

  const renderCell = (hit: Hit<T>, key: string) => {
    return Object.prototype.hasOwnProperty.call(hit, key) ? (
      <Highlight
        hit={hit}
        attribute={key}
        classNames={{
          highlighted: "text-red-100 bg-red-500 p-1",
        }}
      />
    ) : (
      <span className="text-muted-foreground">No value</span>
    );
  };

  return (
    <>
      {items.map((hit) => (
        <Link to={`/drivers/${hit.objectID}`} key={hit.objectID}>
          <TableRow className="odd:bg-muted" key={hit.objectID}>
            {getOrderedKeys().map((key) => (
              <TableCell key={`${hit.objectID}-${key}`}>
                {renderCell(hit, key)}
                {/* {map.get(key)?.displayValue(hit)} */}
              </TableCell>
            ))}
          </TableRow>
        </Link>
      ))}
      <Button
        variant="ghost"
        className=""
        onClick={showMore}
        disabled={isLastPage}
      >
        Show More
      </Button>
    </>
  );
}
