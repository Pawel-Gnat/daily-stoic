import { BookKey, Brain, DoorOpen, Landmark, Loader2, Scroll, ScrollText, Sprout } from "lucide-react";

export const icons = {
  home: Landmark,
  entries: ScrollText,
  login: Sprout,
  register: Brain,
  logout: DoorOpen,
  loader: Loader2,
  blockedEntry: BookKey,
  emptyEntry: Scroll,
  fullEntry: ScrollText,
};

export type IconName = keyof typeof icons;
