import { useQuery } from "@tanstack/react-query";
import ClubCard from "../components/ClubCard";
import SearchBar from "../components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { Club, Session } from "@db/schema";

export default function AllClubs() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clubs, isLoading } = useQuery<
    (Club & { upcomingSessions: Session[] })[]
  >({
    queryKey: ["clubs"],
    queryFn: async () => {
      const response = await fetch("/api/clubs");
      if (!response.ok) throw new Error("Failed to fetch clubs");
      return response.json();
    },
  });

  const filteredClubs = clubs?.filter(
    (club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Available Clubs</h1>
        <p className="text-muted-foreground">
          Browse and book sessions at any of our verified clubs.
        </p>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs?.map((club) => <ClubCard key={club.id} club={club} />)}
        </div>
      )}
    </div>
  );
}
