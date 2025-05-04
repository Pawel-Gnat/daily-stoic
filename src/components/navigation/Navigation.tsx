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
        <Icon name="home" />
        <span className="hidden sm:block">Home</span>
      </NavLink>
      <NavLink href="/entries">
        <Icon name="entries" />
        <span className="hidden sm:block">Entries</span>
      </NavLink>
      {user ? (
        <Button onClick={handleLogout}>
          <Icon name="logout" />
          <span className="hidden sm:block">Logout</span>
        </Button>
      ) : (
        <>
          <NavLink href="/login">
            <Icon name="login" />
            <span className="hidden sm:block">Login</span>
          </NavLink>
          <NavLink href="/register">
            <Icon name="register" />
            <span className="hidden sm:block">Register</span>
          </NavLink>
        </>
      )}
    </nav>
  );
};
