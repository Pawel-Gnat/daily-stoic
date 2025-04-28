import { Card, CardContent } from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card className="max-w-lg mx-auto w-full">
      <CardContent>{children}</CardContent>
    </Card>
  );
}
