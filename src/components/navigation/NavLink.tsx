import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const NavLink = ({ href, children, className }: NavLinkProps) => {
  return (
    <a
      href={href}
      className={cn(
        "flex flex-row gap-2 items-center bg-primary rounded-md text-primary-foreground text-sm px-4 py-2 w-fit",
        className
      )}
    >
      {children}
    </a>
  );
};
