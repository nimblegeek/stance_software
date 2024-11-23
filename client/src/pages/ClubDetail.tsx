import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { format } from "date-fns";
import SessionCard from "../components/SessionCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Club, Session } from "@db/schema";

export default function ClubDetail() {
  const [, params] = useRoute("/club/:id");
  const clubId = params?.id;

  const { data: club, isLoading: isLoadingClub } = useQuery<Club>({
    queryKey: ["club", clubId],
    queryFn: async () => {
      const response = await fetch(`/api/clubs/${clubId}`);
      if (!response.ok) throw new Error("Failed to fetch club");
      return response.json();
    },
  });

  const { data: sessions, isLoading: isLoadingSessions } = useQuery<Session[]>({
    queryKey: ["sessions", clubId],
    queryFn: async () => {
      const response = await fetch(`/api/clubs/${clubId}/sessions`);
      if (!response.ok) throw new Error("Failed to fetch sessions");
      return response.json();
    },
  });

  if (isLoadingClub) {
    return <Skeleton className="h-[500px]" />;
  }

  if (!club) {
    return <div>Club not found</div>;
  }

  return (
    <div className="space-y-8">
      <div 
        className="h-[300px] rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${club.imageUrl})` }}
      >
        <div className="h-full bg-black/50 p-8 flex items-end">
          <div className="text-white">
            <h1 className="text-4xl font-bold">{club.name}</h1>
            <p className="text-lg">{club.address}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Available Open Mat Sessions</h2>
        
        {isLoadingSessions ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[100px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sessions?.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
