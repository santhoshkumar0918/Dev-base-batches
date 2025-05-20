// components/journey/ReservationSystem.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function ReservationSystem({ station }: { station: any }) {
  const [reservationType, setReservationType] = useState<"now" | "schedule">(
    "now"
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState(false);

  const currentDate = new Date();
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const time = new Date(currentDate);
    time.setHours(currentDate.getHours() + i);
    return {
      value: `${time.getHours()}:00`,
      label: time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      available: Math.random() > 0.3, // Randomly set availability
    };
  });

  const handleReserve = () => {
    setReserving(true);

    // Simulate reservation process with blockchain or backend
    setTimeout(() => {
      setReserving(false);
      setReserved(true);
    }, 2000);
  };

  if (reserved) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 pb-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Reservation Confirmed!</h3>
          <p className="text-muted-foreground mb-4">
            You've successfully reserved a charging slot at {station.name}.
          </p>

          <div className="space-y-4 text-left">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Station</span>
                <span className="font-medium">{station.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium">{station.address}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">
                  {reservationType === "schedule" ? selectedTime : "Immediate"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confirmation Code</span>
                <span className="font-medium">
                  DEV-{Math.floor(10000 + Math.random() * 90000)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="outline" className="w-full">
            View Reservation Details
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6 pb-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Reserve at {station.name}</h3>

          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                reservationType === "now"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={() => setReservationType("now")}
            >
              Charge Now
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                reservationType === "schedule"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={() => setReservationType("schedule")}
            >
              Schedule
            </button>
          </div>

          {reservationType === "now" ? (
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  {station.status === "Available" ? (
                    <p>
                      This station is currently available for immediate
                      charging.
                    </p>
                  ) : (
                    <p>
                      There {station.queue === 1 ? "is" : "are"} {station.queue}{" "}
                      vehicle{station.queue !== 1 ? "s" : ""} in queue. Expected
                      wait time:{" "}
                      <span className="font-medium">
                        {station.waitTime} minutes
                      </span>
                      .
                    </p>
                  )}
                </div>
              </div>

              {station.status !== "Available" && (
                <div className="p-3 bg-muted/40 rounded-md">
                  <div className="text-sm font-medium mb-1">
                    Queue Position Benefits:
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Receive notifications as your turn approaches</li>
                    <li>• Earn 5 DEV tokens for waiting in queue</li>
                    <li>• Priority booking for future reservations</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // components/journey/ReservationSystem.tsx (continued)
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p>Select a time slot for your charging session.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`p-2 text-sm font-medium rounded-md border 
                      ${
                        selectedTime === slot.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : slot.available
                          ? "bg-background hover:bg-muted/20"
                          : "bg-muted/20 text-muted-foreground cursor-not-allowed opacity-50"
                      }`}
                    onClick={() =>
                      slot.available && setSelectedTime(slot.value)
                    }
                    disabled={!slot.available}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-muted/40 rounded-md">
                <div className="text-sm font-medium mb-1">
                  Scheduling Benefits:
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Guaranteed charging slot at your selected time</li>
                  <li>• No waiting when you arrive</li>
                  <li>• Earn 3 DEV tokens for planning ahead</li>
                </ul>
              </div>
            </div>
          )}

          <div className="pt-2 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Vehicle</span>
              </div>
              <select className="px-3 py-1 border rounded-md bg-background text-sm">
                <option>Tata Nexon EV</option>
                <option>MG ZS EV</option>
                <option>Hyundai Kona Electric</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Payment Method</span>
              </div>
              <select className="px-3 py-1 border rounded-md bg-background text-sm">
                <option>DEV Wallet (Balance: 120 DEV)</option>
                <option>Credit Card</option>
                <option>UPI</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Button
          className="w-full"
          onClick={handleReserve}
          disabled={
            reserving || (reservationType === "schedule" && !selectedTime)
          }
        >
          {reserving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : reservationType === "now" ? (
            station.status === "Available" ? (
              "Reserve Now"
            ) : (
              "Join Queue"
            )
          ) : (
            "Schedule Reservation"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
