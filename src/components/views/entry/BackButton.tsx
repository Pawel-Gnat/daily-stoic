import { NavLink } from "@/components/navigation/NavLink";
import { ArrowBigLeft } from "lucide-react";

const BackButton = () => {
  return (
    <NavLink href="/entries" className="w-fit bg-paper">
      <ArrowBigLeft className="w-4 h-4" /> Back
    </NavLink>
  );
};

export default BackButton;
