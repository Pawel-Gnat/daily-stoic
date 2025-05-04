import { Icon } from "@/lib/icons";

export const Spinner = () => (
  <div data-testid="spinner" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Icon name="loader" className="h-12 w-12 animate-spin text-golden" />
  </div>
);
