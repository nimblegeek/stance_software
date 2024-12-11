
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import type { Club, Session } from "@db/schema";
import { Link } from "wouter";

export default function OpenMats() {
  const { data: clubs, isLoading } = useQuery<(Club & { upcomingSessions: Session[] })[]>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const response = await fetch("/api/clubs");
      if (!response.ok) throw new Error("Failed to fetch clubs");
      return response.json();
    },
  });

  const allSessions = clubs?.flatMap(club => 
    club.upcomingSessions.map(session => ({
      ...session,
      clubName: club.name,
      clubId: club.id
    }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-center">Explore Open Mat Sessions</h1>
        <p className="text-muted-foreground text-center">Browse and select sessions that fit your schedule.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSessions?.map((session) => (
            <Link key={session.id} href={`/club/${session.clubId}`} className="block hover:block">
              <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors cursor-pointer shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg">{session.clubName} - {format(new Date(session.date), "EEE, MMM d")}</div>
                    <div className="font-medium text-primary">
                      {format(new Date(session.startTime), "h:mm a")} - {format(new Date(session.endTime), "h:mm a")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.maxCapacity - session.currentCapacity} spots left
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-lg">${(session.price / 100).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}