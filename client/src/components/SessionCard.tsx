import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Session } from "@db/schema";

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  const isAvailable = session.currentCapacity < session.maxCapacity;

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <p className="font-medium">
            {format(new Date(session.date), "EEEE, MMMM d")}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(session.startTime), "h:mm a")} - 
            {format(new Date(session.endTime), "h:mm a")}
          </p>
          <p className="text-sm">
            {session.currentCapacity} / {session.maxCapacity} spots filled
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">${session.price / 100}</p>
          <Button 
            className="mt-2"
            disabled={!isAvailable}
            variant={isAvailable ? "default" : "secondary"}
          >
            {isAvailable ? "Book Session" : "Full"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}