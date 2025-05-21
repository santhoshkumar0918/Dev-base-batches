import { Route, Clock, Battery, BatteryCharging, Car, Calendar } from 'lucide-react';

interface JourneySummaryProps {
  origin: string;
  destination: string;
  distance: number;
  totalTime: string;
  departureTime: string;
  arrivalTime: string;
  batteryConsumption: number;
  chargingStops: number;
  selectedVehicle: string;
  initialBatteryLevel: number;
}

export default function JourneySummary({
  origin,
  destination,
  distance,
  totalTime,
  departureTime,
  arrivalTime,
  batteryConsumption,
  chargingStops,
  selectedVehicle,
  initialBatteryLevel
}: JourneySummaryProps) {
  // Mock vehicle data mapping
  const vehicleData: Record<string, { name: string; range: number; batteryCapacity: number }> = {
    'tata-nexon': { name: 'Tata Nexon EV', range: 312, batteryCapacity: 40.5 },
    'mg-zs': { name: 'MG ZS EV', range: 461, batteryCapacity: 50.3 },
    'hyundai-kona': { name: 'Hyundai Kona Electric', range: 452, batteryCapacity: 39.2 },
    'byd-e6': { name: 'BYD e6', range: 415, batteryCapacity: 71.7 },
    'mahindra-xuv400': { name: 'Mahindra XUV400', range: 375, batteryCapacity: 39.4 },
    'kia-ev6': { name: 'Kia EV6', range: 528, batteryCapacity: 77.4 },
  };
  
  const vehicle = vehicleData[selectedVehicle] || { name: 'Selected Vehicle', range: 400, batteryCapacity: 50 };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800">Journey Summary</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-start">
          <Route className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">Route</div>
            <div className="text-sm text-gray-600">{origin} to {destination}</div>
            <div className="text-sm text-gray-600 font-medium">{distance} km</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">Time</div>
            <div className="text-sm text-gray-600">Departure: {departureTime}</div>
            <div className="text-sm text-gray-600">Arrival: {arrivalTime}</div>
            <div className="text-sm text-gray-600 font-medium">Total journey: {totalTime}</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <Car className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">Vehicle</div>
            <div className="text-sm text-gray-600">{vehicle.name}</div>
            <div className="text-sm text-gray-600">Range: {vehicle.range} km</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <Battery className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">Battery</div>
            <div className="text-sm text-gray-600">Initial: {initialBatteryLevel}%</div>
            <div className="text-sm text-gray-600">Consumption: {batteryConsumption}%</div>
            <div className="text-sm text-gray-600">
              <span className="inline-flex items-center">
                <BatteryCharging className="h-4 w-4 text-green-500 mr-1" />
                {chargingStops} charging {chargingStops === 1 ? 'stop' : 'stops'} required
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-900">Battery Sufficiency</div>
            <div className="text-sm font-medium text-green-600">Optimal ✓</div>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <div className="mt-1 text-xs text-gray-500 text-right">
            Battery plan is optimized for this journey
          </div>
        </div>
      </div>
    </div>
  );
}