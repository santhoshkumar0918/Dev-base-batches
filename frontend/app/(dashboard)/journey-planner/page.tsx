"use client";

import { useState } from "react";
import RouteMap from "@/components/layout/journeyRouteMap";
import RouteForm from "@/components/layout/journeyRouteForm";
import BatteryMonitor from "@/components/layout/journeyBatteryMonitor";
import ChargingStations from "@/components/layout/journeyChargingStations";
import ReservationSystem from "@/components/layout/journeyReservationSystem";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function JourneyPlanner() {
  const [route, setRoute] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [batteryStatus, setBatteryStatus] = useState(80);
  const [selectedStation, setSelectedStation] = useState(null);

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Journey Planner</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar - Route form and Battery */}
            <div className="space-y-6">
              <RouteForm
                onRouteSet={setRoute}
                onVehicleSelect={setSelectedVehicle}
              />

              <BatteryMonitor
                percentage={batteryStatus}
                vehicle={selectedVehicle}
                route={route}
              />
            </div>

            {/* Center - Map with route and stations */}
            <div className="lg:col-span-2">
              <RouteMap
                route={route}
                batteryStatus={batteryStatus}
                vehicle={selectedVehicle}
                onStationSelect={setSelectedStation}
              />
            </div>
          </div>

          {/* Charging stations section */}
          {route && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                Recommended Charging Stations
              </h2>
              <ChargingStations
                route={route}
                vehicle={selectedVehicle}
                batteryStatus={batteryStatus}
                onStationSelect={setSelectedStation}
              />
            </div>
          )}

          {/* Reservation section */}
          {selectedStation && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Station Reservation</h2>
              <ReservationSystem station={selectedStation} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
