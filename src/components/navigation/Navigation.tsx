import { Brain, Landmark, ScrollText, Sprout } from "lucide-react";
import { NavLink } from "./NavLink";

export const Navigation = () => {
  return (
    <nav className="flex gap-4">
      <NavLink href="/">
        <Landmark className="h-4 w-4" /> Home
      </NavLink>
      <NavLink href="/entries">
        <ScrollText className="h-4 w-4" /> Entries
      </NavLink>
      <NavLink href="/login">
        <Sprout className="h-4 w-4" /> Login
      </NavLink>
      <NavLink href="/register">
        <Brain className="h-4 w-4" /> Register
      </NavLink>
    </nav>
  );
};
