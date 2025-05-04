import { NavLink } from "@/components/navigation/NavLink";
import { Icon } from "@/lib/icons";

const BackButton = () => {
  return (
    <NavLink href="/entries" className="w-fit bg-paper">
      <Icon name="back" /> Back
    </NavLink>
  );
};

export default BackButton;
