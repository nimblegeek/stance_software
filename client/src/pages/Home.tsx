
import { useQuery } from "@tanstack/react-query";
import ClubCard from "../components/ClubCard";
import SearchBar from "../components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { Club, Session } from "@db/schema";
import { Link } from "wouter";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: clubs, isLoading } = useQuery<(Club & { upcomingSessions: Session[] })[]>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const response = await fetch("/api/clubs");
      if (!response.ok) throw new Error("Failed to fetch clubs");
      return response.json();
    },
  });

  const filteredClubs = clubs?.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.address.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-16 bg-secondary/20 rounded-lg px-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Simplify Your Gym Management
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamline bookings, payments, and member management for gym owners. 
          Members can easily book sessions and manage their schedules all in one place.
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Clubs
            </h2>
            <p className="text-muted-foreground">
              Check in and book your next open mat session.
            </p>
          </div>
          <Link href="/clubs" className="text-primary hover:underline">
            View all clubs →
          </Link>
        </div>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs?.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
