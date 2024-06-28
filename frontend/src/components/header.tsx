import { Github } from "lucide-react";
import { SheetSideNav, SideNavProps } from "./sidenav";

export const Header: React.FC<SideNavProps> = ({ items }) => {
  return (
    <header className="flex sticky top-0 z-50 lg:static h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6 justify-between">
      <SheetSideNav items={items} />
      <div></div>
      <a
        href="https://www.github.com"
        className="hover:bg-slate-200  p-2 transition-all duration-200 ease-in-out rounded-none hover:rounded-[50%]"
      >
        <Github className="h-6 w-6 justify-self-end" />
      </a>
    </header>
  );
};
