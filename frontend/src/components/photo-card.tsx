import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  description?: string;
}

export function PhotoCard({ children, footer, title, description }: CardProps) {
  return (
    <Card className="flex flex-col items-center">
      <CardHeader className="flex-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">{children}</CardContent>
      <CardFooter className="flex-0">{footer}</CardFooter>
    </Card>
  );
}
