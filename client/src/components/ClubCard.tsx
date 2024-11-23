import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Club, Session } from "@db/schema";
import { CalendarDays } from "lucide-react";

interface ClubCardProps {
  club: Club & { upcomingSessions: Session[] };
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Link href={`/club/${club.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden h-full">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${club.imageUrl})` }}
        />
        <CardHeader>
          <h3 className="text-xl font-semibold">{club.name}</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{club.address}</p>
            <p className="mt-2 text-sm line-clamp-2">{club.description}</p>
          </div>
          
          {club.upcomingSessions.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <CalendarDays className="h-4 w-4" />
                <span>Upcoming Sessions</span>
              </div>
              <div className="space-y-3">
                {club.upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-secondary/50 rounded-lg p-3 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-primary">
                          {format(new Date(session.date), "EEE, MMM d")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(session.startTime), "h:mm a")} - {format(new Date(session.endTime), "h:mm a")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(session.price / 100).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {session.maxCapacity - session.currentCapacity} spots left
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
