"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, Clock, ChevronRight, AlertCircle } from "lucide-react";

interface Station {
  id: string;
  name: string;
  address: string;
  status: "Available" | "Busy" | "Limited" | "Offline";
  power: number;
  queue: number;
  waitTime: number;
  availableIn?: number;
  distanceFromRoute: number;
  rate: number;
}

interface Vehicle {
  batteryCapacity: number;
  range: number;
  consumption: number;
}

interface Route {
  startLocation: string;
  destination: string;
  distance: number;
  duration: string;
  recommendedStations: Station[];
}

export default function ChargingStations({
  route,
  vehicle,
  onStationSelect,
}: {
  route: Route | null;
  vehicle: Vehicle | null;
  batteryStatus: number;
  onStationSelect: (station: Station) => void;
}) {
  if (!route || !route.recommendedStations) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {route.recommendedStations.map((station) => (
        <Card key={station.id} className="overflow-hidden">
          <div className={`h-2 ${getAvailabilityColor(station.status)}`}></div>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{station.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {station.address}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                    station.status
                  )}`}
                >
                  {station.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-muted/40 rounded-md">
                  <Zap className="h-4 w-4 mx-auto mb-1" />
                  <div className="font-medium">{station.power} kW</div>
                  <div className="text-xs text-muted-foreground">Power</div>
                </div>

                <div className="p-2 bg-muted/40 rounded-md">
                  <Users className="h-4 w-4 mx-auto mb-1" />
                  <div className="font-medium">{station.queue}</div>
                  <div className="text-xs text-muted-foreground">In Queue</div>
                </div>

                <div className="p-2 bg-muted/40 rounded-md">
                  <Clock className="h-4 w-4 mx-auto mb-1" />
                  <div className="font-medium">{station.waitTime} min</div>
                  <div className="text-xs text-muted-foreground">Wait Time</div>
                </div>
              </div>

              {station.status === "Busy" && (
                <div className="flex gap-2 p-3 bg-red-100 dark:bg-red-950/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-red-700 dark:text-red-300">
                      This station is currently occupied. Expected availability
                      in {station.availableIn} minutes.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Distance from route
                  </span>
                  <span>{station.distanceFromRoute} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Charging time (to 80%)
                  </span>
                  <span>
                    {calculateChargingTime(vehicle, station.power)} min
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cost estimate</span>
                  <span>
                    ₹{calculateCost(vehicle, station.rate).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full flex items-center justify-between"
                  onClick={() => onStationSelect(station)}
                >
                  <span>
                    {station.status === "Available"
                      ? "Reserve Now"
                      : "Join Queue"}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getAvailabilityColor(status: string) {
  switch (status) {
    case "Available":
      return "bg-green-500";
    case "Busy":
      return "bg-red-500";
    case "Limited":
      return "bg-orange-500";
    default:
      return "bg-muted";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Busy":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "Limited":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function calculateChargingTime(vehicle: Vehicle | null, stationPower: number) {
  if (!vehicle) return 0;

  // Simple formula:
  // (Battery capacity * 0.8) kWh / station power kW * 60 min
  // Assumes charging to 80%
  return Math.round(((vehicle.batteryCapacity * 0.8) / stationPower) * 60);
}

function calculateCost(vehicle: Vehicle | null, rate: number) {
  if (!vehicle) return 0;

  // Simple formula: Battery capacity * 0.8 * rate
  return vehicle.batteryCapacity * 0.8 * rate;
}
