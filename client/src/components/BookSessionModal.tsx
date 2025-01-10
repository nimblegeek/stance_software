
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import type { Session } from "@db/schema";
import { useToast } from "@/hooks/use-toast";

interface BookSessionModalProps {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookSessionModal({
  session,
  open,
  onOpenChange,
}: BookSessionModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const availableSpots = session.maxCapacity - session.currentCapacity;

  const handleBooking = () => {
    if (!email && !phone) {
      toast({
        title: "Contact details required",
        description: "Please provide either an email or phone number.",
        variant: "destructive",
      });
      return;
    }

    fetch(`/api/sessions/${session.id}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone })
    })
    .then(res => {
      if (!res.ok) throw new Error('Booking failed');
      toast({
        title: "Session booked!",
        description: "You have successfully booked this session.",
      });
      onOpenChange(false);
    })
    .catch(err => {
      toast({
        title: "Booking failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Open Mat Session</DialogTitle>
          <DialogDescription>
            Enter your contact details to book this session.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Session Details</h4>
            <div className="text-sm">
              <p>
                <span className="text-muted-foreground">Date:</span>{" "}
                {format(new Date(session.date), "EEEE, MMMM d, yyyy")}
              </p>
              <p>
                <span className="text-muted-foreground">Time:</span>{" "}
                {format(new Date(session.startTime), "h:mm a")} -{" "}
                {format(new Date(session.endTime), "h:mm a")}
              </p>
              <p>
                <span className="text-muted-foreground">Price:</span>{" "}
                ${(session.price / 100).toFixed(2)}
              </p>
              <p>
                <span className="text-muted-foreground">Available Spots:</span>{" "}
                {availableSpots} of {session.maxCapacity}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Contact Information</h4>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={availableSpots === 0}>
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
