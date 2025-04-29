import { Navigation } from "./navigation/Navigation";
import { Logo } from "./Logo";
import type { UserDto } from "@/types";

interface Props {
  user: UserDto | undefined;
}

export const Header = ({ user }: Props) => {
  return (
    <header className="flex flex-col gap-2 justify-between items-center px-4 pt-8">
      <Logo />
      <Navigation user={user}/>
    </header>
  );
};
