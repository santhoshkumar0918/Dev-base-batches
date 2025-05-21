"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  MapPin,
  Filter,
  Search,
  ChevronDown,
  Star,
  StarOff,
  Users,
  Clock,
} from "lucide-react";
import { mockChargingStations } from "@/lib/mock-jounery-data";

export default function ChargingPointsPage() {
  const [view, setView] = useState<"map" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStations, setFilteredStations] =
    useState(mockChargingStations);

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">Charging Points</h1>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by location or name"
                className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-md bg-background"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>

              <div className="border rounded-md overflow-hidden flex">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    view === "list"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                  onClick={() => setView("list")}
                >
                  List
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    view === "map"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                  onClick={() => setView("map")}
                >
                  Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {view === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockChargingStations.map((station) => (
              <ChargingStationCard key={station.id} station={station} />
            ))}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden h-[600px] bg-muted/20">
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">Map View</h3>
                <p className="text-muted-foreground">
                  The map integration will display charging stations in your
                  area.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChargingStationCard({ station }: { station: any }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${getAvailabilityColor(station.status)}`}></div>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{station.name}</h3>
              <p className="text-sm text-muted-foreground">{station.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded-full hover:bg-muted"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? (
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                ) : (
                  <StarOff className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                  station.status
                )}`}
              >
                {station.status}
              </div>
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

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Connectors</span>
            <span>{station.connectorTypes.join(", ")}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rate</span>
            <span>₹{station.rate}/kWh</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1">
              Details
            </Button>
            <Button className="flex-1">Reserve</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions
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
