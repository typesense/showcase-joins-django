import React from "react";
import { Icons } from "./icons";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

export interface NavItemProps {
  label: string;
  Icon: React.ElementType; // Allows passing of icon components
  to: string;
}

export interface SideNavProps {
  items: NavItemProps[];
}

const NavItem: React.FC<NavItemProps> = ({ label, Icon, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
        isActive
          ? "bg-muted px-3 py-2 text-primary"
          : "text-muted-foreground hover:text-primary"
      }`
    }
  >
    <Icon className="h-6 w-6" />
    {label}
  </NavLink>
);

export const SideNav: React.FC<SideNavProps> = ({ items }) => (
  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
    {items.map((item, index) => (
      <NavItem key={index} {...item} />
    ))}
  </nav>
);

const SheetNavItem: React.FC<NavItemProps> = ({ label, Icon, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
        isActive
          ? "bg-muted px-3 py-2 text-primary"
          : "text-muted-foreground hover:text-primary"
      }`
    }
  >
    <Icon className="h-5 w-5" />
    {label}
  </NavLink>
);

export const SheetSideNav: React.FC<SideNavProps> = ({ items }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <div className="flex items-center gap-2 md:hidden mb-3">
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
          {items.map((item, index) => (
            <SheetNavItem key={index} {...item} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
