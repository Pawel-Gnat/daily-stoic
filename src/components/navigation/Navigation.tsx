import { Brain, DoorOpen, Landmark, ScrollText, Sprout } from "lucide-react";
import { NavLink } from "./NavLink";
import { useNavigate } from "@/hooks/useNavigate";
import type { UserDto } from "@/types";
import { Button } from "../shared/Button";
import { toast } from "sonner";

interface Props {
  user: UserDto | undefined;
}

export const Navigation = ({ user }: Props) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      navigate("/login");
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to log out.");
      throw error;
    }
  };

  return (
    <nav className="flex gap-4">
      <NavLink href="/">
        <Landmark className="h-4 w-4" /> Home
      </NavLink>
      <NavLink href="/entries">
        <ScrollText className="h-4 w-4" /> Entries
      </NavLink>
      {user ? (
        <Button onClick={handleLogout}>
          <DoorOpen className="h-4 w-4" /> Logout
        </Button>
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
