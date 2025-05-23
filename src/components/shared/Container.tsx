import { cn } from "@/lib/utils";

export const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("container mx-auto max-w-2xl mt-6 flex flex-col gap-4", className)}>{children}</div>;
};
