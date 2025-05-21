"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Battery, AlertTriangle, Zap } from "lucide-react";

export default function BatteryMonitor({
  percentage = 80,
  vehicle = null,
  route = null,
}: {
  percentage: number;
  vehicle: any;
  route: any;
}) {
  const estimatedRange = vehicle
    ? Math.round((vehicle.range * percentage) / 100)
    : 0;
  const requiredRange = route?.distance || 0;
  const needsCharging = route && estimatedRange < requiredRange;
  const chargingStopsNeeded =
    route &&
    Math.ceil((requiredRange - estimatedRange) / (vehicle?.range || 1));

  let batteryColor = "text-green-500";
  if (percentage < 40) batteryColor = "text-orange-500";
  if (percentage < 20) batteryColor = "text-red-500";

  return (
    <Card>
      <CardContent className="pt-6 pb-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Battery Status</h2>

          <div className="flex items-center gap-3">
            <Battery className={`h-8 w-8 ${batteryColor}`} />
            <div>
              <div className="text-2xl font-bold">{percentage}%</div>
              <div className="text-sm text-muted-foreground">
                Current Charge
              </div>
            </div>
          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                percentage > 40
                  ? "bg-green-500"
                  : percentage > 20
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {vehicle && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <div className="text-lg font-bold">{estimatedRange} km</div>
                <div className="text-xs text-muted-foreground">
                  Estimated Range
                </div>
              </div>

              {route && (
                <div>
                  <div className="text-lg font-bold">{route.distance} km</div>
                  <div className="text-xs text-muted-foreground">
                    Journey Distance
                  </div>
                </div>
              )}
            </div>
          )}

          {needsCharging && (
            <div className="flex gap-2 p-3 bg-orange-100 dark:bg-orange-950/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 dark:text-orange-400">
                  Charging Required
                </p>
                <p className="text-orange-700 dark:text-orange-300">
                  You'll need approximately {chargingStopsNeeded} charging{" "}
                  {chargingStopsNeeded === 1 ? "stop" : "stops"} to complete
                  this journey.
                </p>
              </div>
            </div>
          )}

          {vehicle && (
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Consumption: {vehicle.consumption} kWh/100km</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
