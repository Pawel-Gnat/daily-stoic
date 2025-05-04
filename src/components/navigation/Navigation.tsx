import { NavLink } from "./NavLink";
import { useNavigate } from "@/hooks/useNavigate";
import type { UserDto } from "@/types";
import { Button } from "../shared/Button";
import { toast } from "sonner";
import { Icon } from "@/lib/icons";

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
        <Icon name="home" /> Home
      </NavLink>
      <NavLink href="/entries">
        <Icon name="entries" /> Entries
      </NavLink>
      {user ? (
        <Button onClick={handleLogout}>
          <Icon name="logout" /> Logout
        </Button>
      ) : (
        <>
          <NavLink href="/login">
            <Icon name="login" /> Login
          </NavLink>
          <NavLink href="/register">
            <Icon name="register" /> Register
          </NavLink>
        </>
      )}
    </nav>
  );
};
