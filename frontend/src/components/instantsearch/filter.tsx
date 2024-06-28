import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FilterIcon } from "lucide-react";
import {
  useInstantSearch,
  useRefinementList,
  UseRefinementListProps,
} from "react-instantsearch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export function MultiFilter({ props }: { props: UseRefinementListProps[] }) {
  const { uiState, setUiState } = useInstantSearch();
  const uiStateRef = React.useRef(uiState);

  // Keep up to date uiState in a reference
  React.useEffect(() => {
    uiStateRef.current = uiState;
  }, [uiState]);

  // Apply latest uiState to InstantSearch as the component is unmounted
  React.useEffect(() => {
    return () => {
      setTimeout(() => setUiState(uiStateRef.current));
    };
  }, [setUiState]);
  return (
    <>
      {props.map((prop) => (
        <VirtualFilters key={prop.attribute} attribute={prop.attribute} />
      ))}
      <DrawerSheet>
        <div className="flex flex-col gap-3">
          {props.map((filterProps, index) => (
            <Filter key={index} {...filterProps} />
          ))}
        </div>
      </DrawerSheet>
    </>
  );
}

export function VirtualFilters({ attribute }: { attribute: string }) {
  useRefinementList({ attribute });

  return null;
}

export function Filter(props: UseRefinementListProps) {
  //NOTE: For some reason, canToggleShowMore is not working as expected. Also, for mobile screens, the showMore button doesn't actually show more, even though the feature works on desktop.
  const { items, refine, toggleShowMore, isShowingMore, searchForItems } =
    useRefinementList(props);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) {
    return (
      <div className="flex flex-col gap-2">
        <Accordion type="single" collapsible>
          <AccordionItem value={props.attribute} key={props.attribute}>
            <AccordionTrigger className="hover:no-underline hover:bg-muted rounded-lg  transition  duration-300 ease-in-out ">
              {props.attribute
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </AccordionTrigger>
            <AccordionContent className=" my-3  flex flex-col gap-2 ">
              {items
                .sort((a, b) => Number(b.value) - Number(a.value))
                .map((item) => (
                  <div
                    key={item.value}
                    className="flex justify-between "
                    onClick={() => refine(item.value)}
                  >
                    <Label
                      htmlFor={item.value}
                      className="flex items-center gap-1 text-sm"
                    >
                      {item.label}
                      <span className="text-muted-foreground">
                        ({item.count})
                      </span>
                    </Label>
                    <Checkbox
                      value={item.value}
                      checked={item.isRefined}
                      onCheckedChange={() => refine(item.value)}
                    />
                  </div>
                ))}
              <Button
                onClick={toggleShowMore}
                className="flex justify-between px-0"
                variant={"link"}
              >
                Show {isShowingMore ? "less" : "more"}
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  const checkedItems = items
    .filter((item) => item.isRefined)
    .sort((a, b) => Number(b.value) - Number(a.value));

  const uncheckedItems = items
    .filter((item) => !item.isRefined)
    .sort((a, b) => Number(b.value) - Number(a.value));

  const limit = props.limit ?? 5;

  const topItems =
    checkedItems.length > limit
      ? checkedItems
          .slice(0, checkedItems.length)
          .sort((a, b) => Number(b.value) - Number(a.value))
      : [
          ...checkedItems,
          ...uncheckedItems.slice(0, limit - checkedItems.length),
        ].sort((a, b) =>
          a.isRefined === b.isRefined
            ? Number(b.value) - Number(a.value)
            : a.isRefined
              ? -1
              : 1,
        );

  // For the ScrollArea, simply concatenate checked items with sorted unchecked items
  const scrollAreaItems = [
    ...checkedItems,
    ...uncheckedItems.sort((a, b) => Number(b.value) - Number(a.value)),
  ];

  return (
    <div className="flex flex-col gap-3 ">
      <h1 className="text-xl font-semibold mt-1 px-4">
        {props.attribute
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </h1>
      {topItems.map((item) => (
        <div key={item.label} className="flex gap-3 px-4">
          <Checkbox
            value={item.value}
            checked={item.isRefined}
            onCheckedChange={() => refine(item.value)}
          />
          <Label
            htmlFor={item.value}
            className="flex items-center gap-1 text-sm"
          >
            {item.label}
            <span className="text-muted-foreground">({item.count})</span>
          </Label>
        </div>
      ))}
      <Accordion type="single" collapsible>
        <AccordionItem key={props.attribute} value={props.attribute}>
          <AccordionTrigger
            onClick={toggleShowMore}
            className=" mb-3 font-medium hover:no-underline hover:bg-muted disabled:hover:bg-background rounded-lg px-4 transition disabled:text-muted-foreground duration-300 ease-in-out"
          >
            Show More
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3 ">
              <Input
                type="search"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={true}
                onChange={(e) => searchForItems(e.currentTarget.value)}
                className=" my-1 w-[90%] mx-4 border-bg-muted-foreground"
              />
              <Separator className="my-2" />
              <ScrollArea className="max-h-[40vh] overflow-auto ">
                <div className="gap-3 flex flex-col">
                  {scrollAreaItems
                    .sort((a, b) => Number(b.value) - Number(a.value))
                    .map((item) => (
                      <div key={item.label} className="flex gap-3 px-4 ">
                        <Checkbox
                          value={item.value}
                          checked={item.isRefined}
                          onCheckedChange={() => refine(item.value)}
                        />
                        <Label
                          key={item.value}
                          htmlFor={item.value}
                          className="flex items-center gap-1 text-sm"
                        >
                          {item.label}
                          <span className="text-muted-foreground">
                            ({item.count})
                          </span>
                        </Label>
                      </div>
                    ))}
                </div>
              </ScrollArea>
              <Separator className="my-2" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
export function DrawerSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex gap-2 font-medium  px-3">
            <span>Filter</span>
            <FilterIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-[425px] overflow-y-auto  px-0 w-[350px]">
          <SheetTitle className="text-2xl font-semibold tracking-tight px-4">
            Filter
          </SheetTitle>
          <SheetDescription className="mb-8 px-4">
            Any filters you click on will be automatically applied to your
            search
          </SheetDescription>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Filter</DrawerTitle>
          <DrawerDescription>
            Any filters you click on will be automatically applied to your
            search
          </DrawerDescription>
        </DrawerHeader>
        <Separator />
        <ScrollArea className="p-4 max-h-[60vh] overflow-auto">
          {children}
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
