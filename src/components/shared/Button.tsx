import { Button as ButtonUI } from "../ui/button";

interface ButtonProps extends React.ComponentProps<typeof ButtonUI> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <ButtonUI
      className="bg-golden border border-golden h-auto hover:bg-primary text-primary font-normal hover:text-secondary"
      {...props}
    >
      {children}
    </ButtonUI>
  );
}
