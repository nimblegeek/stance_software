import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { Club } from "@db/schema";

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Link href={`/club/${club.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${club.imageUrl})` }}
        />
        <CardHeader>
          <h3 className="text-xl font-semibold">{club.name}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{club.address}</p>
          <p className="mt-2 text-sm line-clamp-2">{club.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
