import { useState } from 'react';
import { Car, ChevronDown } from 'lucide-react';

// Mock vehicle data
const vehicleOptions = [
  { id: 'tata-nexon', name: 'Tata Nexon EV', range: 312, batteryCapacity: 40.5 },
  { id: 'mg-zs', name: 'MG ZS EV', range: 461, batteryCapacity: 50.3 },
  { id: 'hyundai-kona', name: 'Hyundai Kona Electric', range: 452, batteryCapacity: 39.2 },
  { id: 'byd-e6', name: 'BYD e6', range: 415, batteryCapacity: 71.7 },
  { id: 'mahindra-xuv400', name: 'Mahindra XUV400', range: 375, batteryCapacity: 39.4 },
  { id: 'kia-ev6', name: 'Kia EV6', range: 528, batteryCapacity: 77.4 },
];

interface VehicleSelectorProps {
  selectedVehicle: string;
  setSelectedVehicle: (vehicle: string) => void;
}

export default function VehicleSelector({ selectedVehicle, setSelectedVehicle }: VehicleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setIsOpen(false);
  };
  
  const selectedVehicleData = vehicleOptions.find(v => v.id === selectedVehicle);
  
  return (
    <div className="relative">
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          {selectedVehicle ? (
            <>
              <Car className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <span className="block truncate">{selectedVehicleData?.name}</span>
                <span className="block text-sm text-gray-500 truncate">
                  Range: {selectedVehicleData?.range} km • Battery: {selectedVehicleData?.batteryCapacity} kWh
                </span>
              </div>
            </>
          ) : (
            <>
              <Car className="h-5 w-5 text-gray-400 mr-3" />
              <span className="block truncate text-gray-500">Select your vehicle model</span>
            </>
          )}
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          <div className="p-2">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Search vehicles..."
            />
          </div>
          <ul className="mt-1">
            {vehicleOptions.map((vehicle) => (
              <li
                key={vehicle.id}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                  selectedVehicle === vehicle.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                }`}
                onClick={() => handleSelect(vehicle.id)}
              >
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className={`block truncate ${selectedVehicle === vehicle.id ? 'font-medium' : 'font-normal'}`}>
                      {vehicle.name}
                    </span>
                    <span className="block text-sm text-gray-500 truncate">
                      Range: {vehicle.range} km • Battery: {vehicle.batteryCapacity} kWh
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}