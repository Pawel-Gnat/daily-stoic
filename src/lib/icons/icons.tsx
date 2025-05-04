import {
  ArrowBigLeft,
  BookKey,
  BookOpen,
  BookOpenText,
  BookX,
  Brain,
  DoorOpen,
  Feather,
  Landmark,
  Loader2,
  Scroll,
  ScrollText,
  Sprout,
} from "lucide-react";

export const icons = {
  home: Landmark,
  entries: ScrollText,
  login: Sprout,
  register: Brain,
  logout: DoorOpen,
  loader: Loader2,
  disabled: BookKey,
  delete: BookX,
  back: ArrowBigLeft,
  "empty-entry": Scroll,
  "full-entry": ScrollText,
  "empty-book": BookOpen,
  "full-book": BookOpenText,
  quote: Feather,
};

export type IconName = keyof typeof icons;
