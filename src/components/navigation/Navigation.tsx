import { Brain, Landmark, ScrollText, Sprout } from "lucide-react";
import { NavLink } from "./NavLink";
import React, { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@/hooks/useNavigate";
import type { UserDto } from "@/types";

interface Props {
  user: UserDto | undefined;
}

export const Navigation = ({ user }: Props) => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }, [logout, navigate]);

  return (
    <nav className="flex gap-4">
      <NavLink href="/">
        <Landmark className="h-4 w-4" /> Home
      </NavLink>
      <NavLink href="/entries">
        <ScrollText className="h-4 w-4" /> Entries
      </NavLink>
      {user ? (
        <button onClick={handleLogout} className="text-primary hover:underline flex items-center gap-1">
          <Sprout className="h-4 w-4" /> Logout
        </button>
      ) : (
        <>
          <NavLink href="/login">
            <Sprout className="h-4 w-4" /> Login
          </NavLink>
          <NavLink href="/register">
            <Brain className="h-4 w-4" /> Register
          </NavLink>
        </>
      )}
    </nav>
  );
};
