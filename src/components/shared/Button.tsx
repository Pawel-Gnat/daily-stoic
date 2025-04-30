import { cn } from "@/lib/utils";
import { Button as ButtonUI } from "../ui/button";

interface ButtonProps extends React.ComponentProps<typeof ButtonUI> {
  children: React.ReactNode;
  dataTestId?: string;
}

export function Button({ children, dataTestId, ...props }: ButtonProps) {
  return (
    <ButtonUI
      {...props}
      className={cn(
        "bg-golden border border-golden h-auto hover:bg-primary text-primary font-normal hover:text-secondary",
        props.className
      )}
      data-testid={dataTestId}
    >
      {children}
    </ButtonUI>
  );
}
