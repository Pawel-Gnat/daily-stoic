import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

interface MainProps {
  className?: string;
}

export default function Main({ children, className }: PropsWithChildren<MainProps>) {
  return <main className={cn("px-4 pb-4", className)}>{children}</main>;
}
