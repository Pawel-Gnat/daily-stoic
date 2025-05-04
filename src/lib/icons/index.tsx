import { cn } from "../utils";
import { icons, type IconName } from "./icons";

interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon = ({ name, className }: IconProps) => {
  const IconComponent = icons[name];
  return <IconComponent className={cn("h-4 w-4", className)} />;
};
