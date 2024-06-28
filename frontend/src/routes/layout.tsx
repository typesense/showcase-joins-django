import { Home, ShieldHalf, User } from "lucide-react";
import { MainNav } from "@/components/main-nav";
import { Header } from "@/components/header";
import { Outlet } from "react-router-dom";
import type { NavItemProps } from "@/components/sidenav";
import { Icons } from "@/components/icons";

const items: NavItemProps[] = [
  {
    label: "Home",
    Icon: Home,
    to: "/",
  },
  {
    label: "Drivers",
    Icon: User,
    to: "/drivers",
  },
  {
    label: "Teams",
    Icon: ShieldHalf,
    to: "/teams",
  },
  {
    label: "Circuits",
    Icon: Icons.monza,
    to: "/circuits",
  },
];

const RootLayout = () => (
  <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr]">
    <MainNav items={items} />
    <div className="flex flex-col">
      <Header items={items} />
      <main className="flex flex-1 flex-col gap-4  lg:gap-6 p-4">
        <Outlet />
      </main>
    </div>
  </div>
);

export default RootLayout;
