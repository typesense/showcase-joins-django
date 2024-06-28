import {
  useCurrentRefinements,
  UseCurrentRefinementsProps,
} from "react-instantsearch";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";

export function CurrentRefinements(props: UseCurrentRefinementsProps) {
  const { items, refine } = useCurrentRefinements(props);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) {
    return (
      <ScrollArea className="max-w-[80vw] whitespace-nowrap relative -mx-3">
        <div className="z-10 absolute h-full w-[7%] left-0 bg-gradient-to-l from-transparent to-background"></div>
        <div className="z-10 absolute h-full w-[7%] right-0 bg-gradient-to-r from-transparent to-background"></div>
        <div className="flex w-max space-x-3 mx-3">
          {items
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((item) =>
              item.refinements.map((refinement) => (
                <Button
                  onClick={() => {
                    refine(refinement);
                  }}
                  variant={"outline"}
                  className="rounded-full"
                  key={[item.indexName, item.label, refinement.label].join("/")}
                  size={"sm"}
                >
                  <span>{`${item.label
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}: ${refinement.label}`}</span>
                  <X className="h-5" />
                </Button>
              )),
            )}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    );
  }
  return (
    <div className="flex gap-3 flex-wrap">
      {items
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((item) =>
          item.refinements.map((refinement) => (
            <Button
              onClick={() => {
                refine(refinement);
              }}
              variant={"outline"}
              className="rounded-full"
              key={[item.indexName, item.label, refinement.label].join("/")}
              size={"sm"}
            >
              <span>{`${item.label
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}: ${refinement.label}`}</span>
              <X className="h-5" />
            </Button>
          )),
        )}
    </div>
  );
}
