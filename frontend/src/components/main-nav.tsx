import { Icons } from "./icons";
import { SideNav, type SideNavProps } from "./sidenav";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const MainNav: React.FC<SideNavProps> = ({ items }) => {
  return (
    <div className="hidden border-r bg-muted/40 md:block ">
      <div className="flex h-full max-h-screen flex-col gap-2 sticky right-0 top-0">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2">
            <a
              href="https://typesense.org/"
              target="_blank"
              rel="noopener noreferrer"
              id="typesenseLink"
              className="text-center text-xl text-red-600"
            >
              type<b>sense</b>|
            </a>
            &
            <Icons.django className="h-5 " />
          </div>
        </div>
        <div className="flex-1">
          <SideNav items={items} />
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle className="mb-3">Powered by Typesense</CardTitle>
              <CardDescription>
                Start using Typesense today. Lightning fast open source search
                engine, no PhD required.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full" variant={"pill"}>
                <a
                  href="https://typesense.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Typesense Docs
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
