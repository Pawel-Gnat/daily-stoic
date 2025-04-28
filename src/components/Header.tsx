import { Navigation } from "./navigation/Navigation";
import { Logo } from "./Logo";
export const Header = () => {
  return (
    <header className="flex flex-col gap-2 justify-between items-center px-4 pt-8">
      <Logo />
      <Navigation />
    </header>
  );
};
