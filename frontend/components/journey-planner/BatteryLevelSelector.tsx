import { Battery, BatteryCharging, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';

interface BatteryLevelSelectorProps {
  batteryLevel: number;
  setBatteryLevel: (level: number) => void;
}

export default function BatteryLevelSelector({ batteryLevel, setBatteryLevel }: BatteryLevelSelectorProps) {
  const getBatteryIcon = () => {
    if (batteryLevel > 75) return <Battery className="h-6 w-6 text-green-500" />;
    if (batteryLevel > 50) return <BatteryMedium className="h-6 w-6 text-green-500" />;
    if (batteryLevel > 25) return <BatteryLow className="h-6 w-6 text-yellow-500" />;
    return <BatteryWarning className="h-6 w-6 text-red-500" />;
  };

  const getBatteryColor = () => {
    if (batteryLevel > 75) return 'bg-green-500';
    if (batteryLevel > 50) return 'bg-green-400';
    if (batteryLevel > 25) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  const handleQuickSelect = (level: number) => {
    setBatteryLevel(level);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="mr-4">
          {getBatteryIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${getBatteryColor()}`} 
              style={{ width: `${batteryLevel}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">{batteryLevel}%</span>
          <div className="space-x-1">
            <input
              type="number"
              min="0"
              max="100"
              value={batteryLevel}
              onChange={(e) => setBatteryLevel(Number(e.target.value))}
              className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between space-x-2">
        {[100, 75, 50, 25, 10].map((level) => (
          <button
            key={level}
            onClick={() => handleQuickSelect(level)}
            className={`px-3 py-1 text-sm rounded-md ${
              batteryLevel === level
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {level}%
          </button>
        ))}
      </div>
    </div>
  );
}