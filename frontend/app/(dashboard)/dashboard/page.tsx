"use client";

import { useState } from "react";
import { Battery, Zap, MapPin, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  mockChargingStations,
  mockJourneyData,
  mockVehicles,
} from "@/lib/mock-jounery-data";

export default function DashboardPage() {
  const [savedRoutes, setSavedRoutes] = useState([
    {
      id: "route-1",
      name: "Home to Office",
      start: "Thane, Maharashtra",
      destination: "Bandra Kurla Complex, Mumbai",
      distance: 28,
      lastUsed: "2 days ago",
    },
    {
      id: "route-2",
      name: "Mumbai to Pune",
      start: "Dadar, Mumbai",
      destination: "Hinjewadi, Pune",
      distance: 147,
      lastUsed: "2 weeks ago",
    },
  ]);

  const vehicle = mockVehicles[0]; // Default to first vehicle

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-muted-foreground text-sm">
                    Current Vehicle
                  </h3>
                  <p className="text-lg font-bold">
                    {vehicle.make} {vehicle.model}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center">
                  <Battery className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-3xl font-bold">
                  {mockJourneyData.batteryStatus.currentPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Battery
                </div>

                <div className="mt-2 w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${mockJourneyData.batteryStatus.currentPercentage}%`,
                    }}
                  ></div>
                </div>

                <div className="mt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Range
                    </span>
                    <span className="font-medium">
                      {mockJourneyData.batteryStatus.estimatedRange} km
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-muted-foreground text-sm">
                    Nearest Station
                  </h3>
                  <p className="text-lg font-bold">
                    {mockChargingStations[0].name}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="text-sm">
                  <div className="text-muted-foreground mb-1">Address</div>
                  <div>{mockChargingStations[0].address}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="p-2 bg-muted/40 rounded-md">
                    <div className="font-medium">
                      {mockChargingStations[0].power} kW
                    </div>
                    <div className="text-xs text-muted-foreground">Power</div>
                  </div>

                  <div className="p-2 bg-muted/40 rounded-md">
                    <div className="font-medium">
                      {mockChargingStations[0].distanceFromRoute} km
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Distance
                    </div>
                  </div>

                  <div className="p-2 bg-muted/40 rounded-md">
                    <div className="font-medium text-green-600">Available</div>
                    <div className="text-xs text-muted-foreground">Status</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" size="sm">
                Navigate
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-muted-foreground text-sm">
                    Next Reservation
                  </h3>
                  <p className="text-lg font-bold">No Upcoming Reservations</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center p-6">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-4">
                    You don't have any upcoming charging reservations.
                  </p>
                  <Button variant="outline" size="sm">
                    Book a Charging Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Updates</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {mockJourneyData.realTimeUpdates.map((update, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center
                    ${
                      update.type === "battery"
                        ? "bg-orange-100 text-orange-600"
                        : update.type === "station"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {update.type === "battery" ? (
                      <Battery className="h-4 w-4" />
                    ) : update.type === "station" ? (
                      <Zap className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{update.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(update.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Saved Routes</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedRoutes.map((route) => (
              <div
                key={route.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{route.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {route.start} to {route.destination}
                  </p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {route.distance} km
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Last used: {route.lastUsed}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
