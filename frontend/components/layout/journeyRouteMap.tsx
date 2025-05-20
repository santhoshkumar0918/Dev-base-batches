"use client";

import { useEffect, useRef } from "react";
import { MapPin, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function RouteMap({
  route,
  batteryStatus,
  vehicle,
  onStationSelect,
}: {
  route: any;
  batteryStatus: number;
  vehicle: any;
  onStationSelect: (station: any) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (route && mapRef.current) {
      // In a real implementation, this would initialize and update
      // a map with the route, charging stations, etc.
      console.log("Map would update with route:", route);
    }
  }, [route]);

  // Mock function to handle station marker clicks
  const handleStationClick = (stationId: string) => {
    if (route && route.recommendedStations) {
      const station = route.recommendedStations.find((s) => s.id === stationId);
      if (station) {
        onStationSelect(station);
      }
    }
  };

  return (
    <Card className="h-96 lg:h-full min-h-[400px] overflow-hidden">
      {!route ? (
        <div className="h-full flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-medium">Enter your journey details</p>
            <p className="text-sm text-muted-foreground">
              We'll calculate the optimal route with charging stations
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={mapRef}
          className="h-full w-full relative bg-muted/20"
          style={{
            backgroundImage: "url('/map-placeholder.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Map placeholder with route visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <p className="font-bold">
                {route.startLocation} to {route.destination}
              </p>
              <p className="text-sm text-muted-foreground">
                Distance: {route.distance} km • Est. Time: {route.duration}
              </p>
            </div>
          </div>

          {/* Charging station markers would be placed here */}
          {route.recommendedStations &&
            route.recommendedStations.map((station, index) => (
              <div
                key={station.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${25 + index * 25}%`,
                  top: "50%",
                }}
                onClick={() => handleStationClick(station.id)}
              >
                <div className="bg-primary text-primary-foreground p-1 rounded-full">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="text-xs font-bold mt-1 bg-background/80 p-1 rounded shadow">
                  {station.name}
                </div>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}
