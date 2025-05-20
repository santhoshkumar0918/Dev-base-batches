"use client";

import { useState } from "react";
import { Search, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { mockCalculateRoute, mockVehicles } from "@/lib/mock-jounery-data";

export default function RouteForm({
  onRouteSet,
  onVehicleSelect,
}: {
  onRouteSet: (route: any) => void;
  onVehicleSelect: (vehicle: any) => void;
}) {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicle, setVehicle] = useState(mockVehicles[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startLocation || !destination) return;

    setLoading(true);

    // Simulate API call for route calculation
    setTimeout(() => {
      const route = mockCalculateRoute(startLocation, destination, vehicle);
      onRouteSet(route);
      onVehicleSelect(vehicle);
      setLoading(false);
    }, 1000);
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVehicle = mockVehicles.find((v) => v.id === e.target.value);
    setVehicle(selectedVehicle || mockVehicles[0]);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Plan Your Journey</h2>

            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="Starting point"
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  required
                />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination"
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  required
                />
              </div>

              <div className="relative">
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <select
                  value={vehicle?.id}
                  onChange={handleVehicleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background appearance-none"
                >
                  {mockVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.batteryCapacity} kWh)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={!startLocation || !destination || loading}
          >
            {loading ? "Calculating Route..." : "Plan Journey"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
