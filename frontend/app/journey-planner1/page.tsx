// 'use client';

// import { useState, useEffect } from 'react';
// import { Search, Calendar, Battery, MapPin, Clock, ChevronRight, Car, Wallet } from 'lucide-react';
// import { ethers } from 'ethers';

// // Contract ABIs
// const JOURNEY_PLANNER_ABI = [
//   {
//     "inputs": [
//       {"internalType": "string", "name": "_origin", "type": "string"},
//       {"internalType": "string", "name": "_destination", "type": "string"},
//       {"internalType": "uint256", "name": "_userVehicleIndex", "type": "uint256"},
//       {"internalType": "uint256", "name": "_totalDistance", "type": "uint256"},
//       {"internalType": "uint256", "name": "_estimatedTotalTime", "type": "uint256"},
//       {"internalType": "uint256", "name": "_departureTime", "type": "uint256"},
//       {"internalType": "uint256[]", "name": "_chargingStationIds", "type": "uint256[]"},
//       {"components": [
//         {"internalType": "uint256", "name": "stationId", "type": "uint256"},
//         {"internalType": "uint256", "name": "estimatedArrivalTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "estimatedDepartureTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "chargingDuration", "type": "uint256"},
//         {"internalType": "uint256", "name": "expectedChargeAmount", "type": "uint256"},
//         {"internalType": "bool", "name": "isCompleted", "type": "bool"}
//       ], "internalType": "struct JourneyPlanner.ChargingStop[]", "name": "_chargingStops", "type": "tuple[]"}
//     ],
//     "name": "planJourney",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "uint256", "name": "_journeyId", "type": "uint256"}],
//     "name": "getJourney",
//     "outputs": [
//       {"components": [
//         {"internalType": "uint256", "name": "id", "type": "uint256"},
//         {"internalType": "address", "name": "user", "type": "address"},
//         {"internalType": "string", "name": "origin", "type": "string"},
//         {"internalType": "string", "name": "destination", "type": "string"},
//         {"internalType": "uint256", "name": "vehicleId", "type": "uint256"},
//         {"internalType": "uint256", "name": "userVehicleIndex", "type": "uint256"},
//         {"internalType": "uint256", "name": "initialBatteryLevel", "type": "uint256"},
//         {"internalType": "uint256", "name": "totalDistance", "type": "uint256"},
//         {"internalType": "uint256", "name": "estimatedTotalTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "departureTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "estimatedArrivalTime", "type": "uint256"},
//         {"internalType": "uint256[]", "name": "chargingStationIds", "type": "uint256[]"},
//         {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
//         {"internalType": "enum JourneyPlanner.JourneyStatus", "name": "status", "type": "uint8"}
//       ], "internalType": "struct JourneyPlanner.Journey", "name": "", "type": "tuple"},
//       {"components": [
//         {"internalType": "uint256", "name": "stationId", "type": "uint256"},
//         {"internalType": "uint256", "name": "estimatedArrivalTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "estimatedDepartureTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "chargingDuration", "type": "uint256"},
//         {"internalType": "uint256", "name": "expectedChargeAmount", "type": "uint256"},
//         {"internalType": "bool", "name": "isCompleted", "type": "bool"}
//       ], "internalType": "struct JourneyPlanner.ChargingStop[]", "name": "", "type": "tuple[]"}
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
//     "name": "getUserJourneys",
//     "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getCurrentJourneyId",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];

// const BOOKING_MANAGER_ABI = [
//   {
//     "inputs": [
//       {"internalType": "uint256", "name": "_stationId", "type": "uint256"},
//       {"internalType": "uint256", "name": "_slotNumber", "type": "uint256"},
//       {"internalType": "uint256", "name": "_journeyId", "type": "uint256"},
//       {"internalType": "uint256", "name": "_scheduledStartTime", "type": "uint256"},
//       {"internalType": "uint256", "name": "_estimatedChargingDuration", "type": "uint256"}
//     ],
//     "name": "createBooking",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "uint256", "name": "_bookingId", "type": "uint256"}],
//     "name": "getBooking",
//     "outputs": [
//       {"components": [
//         {"internalType": "uint256", "name": "id", "type": "uint256"},
//         {"internalType": "address", "name": "user", "type": "address"},
//         {"internalType": "uint256", "name": "stationId", "type": "uint256"},
//         {"internalType": "uint256", "name": "slotNumber", "type": "uint256"},
//         {"internalType": "uint256", "name": "journeyId", "type": "uint256"},
//         {"internalType": "uint256", "name": "scheduledStartTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "scheduledEndTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "estimatedChargingDuration", "type": "uint256"},
//         {"internalType": "uint256", "name": "bookedAt", "type": "uint256"},
//         {"internalType": "enum BookingManager.BookingStatus", "name": "status", "type": "uint8"},
//         {"internalType": "uint256", "name": "actualStartTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "actualEndTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "totalCost", "type": "uint256"},
//         {"internalType": "bool", "name": "isPaid", "type": "bool"}
//       ], "internalType": "struct BookingManager.Booking", "name": "", "type": "tuple"}
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];

// const VEHICLE_REGISTRY_ABI = [
//   {
//     "inputs": [
//       {"internalType": "string", "name": "_model", "type": "string"},
//       {"internalType": "string", "name": "_brand", "type": "string"},
//       {"internalType": "uint256", "name": "_batteryCapacity", "type": "uint256"},
//       {"internalType": "uint256", "name": "_range", "type": "uint256"},
//       {"internalType": "uint256", "name": "_chargingSpeed", "type": "uint256"}
//     ],
//     "name": "addVehicle",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
//     "name": "getUserVehicles",
//     "outputs": [
//       {"components": [
//         {"internalType": "uint256", "name": "vehicleId", "type": "uint256"},
//         {"internalType": "address", "name": "owner", "type": "address"},
//         {"internalType": "string", "name": "licensePlate", "type": "string"},
//         {"internalType": "uint256", "name": "currentBatteryLevel", "type": "uint256"},
//         {"internalType": "uint256", "name": "lastUpdated", "type": "uint256"}
//       ], "internalType": "struct VehicleRegistry.UserVehicle[]", "name": "", "type": "tuple[]"}
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "uint256", "name": "_vehicleId", "type": "uint256"}],
//     "name": "getVehicle",
//     "outputs": [
//       {"components": [
//         {"internalType": "uint256", "name": "id", "type": "uint256"},
//         {"internalType": "string", "name": "model", "type": "string"},
//         {"internalType": "string", "name": "brand", "type": "string"},
//         {"internalType": "uint256", "name": "batteryCapacity", "type": "uint256"},
//         {"internalType": "uint256", "name": "range", "type": "uint256"},
//         {"internalType": "uint256", "name": "chargingSpeed", "type": "uint256"},
//         {"internalType": "bool", "name": "isActive", "type": "bool"},
//         {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
//       ], "internalType": "struct VehicleRegistry.Vehicle", "name": "", "type": "tuple"}
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {"internalType": "uint256", "name": "_vehicleId", "type": "uint256"},
//       {"internalType": "string", "name": "_licensePlate", "type": "string"},
//       {"internalType": "uint256", "name": "_currentBatteryLevel", "type": "uint256"}
//     ],
//     "name": "registerUserVehicle",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   }
// ];

// // Placeholder for ChargingStationManager ABI - add your actual ABI here
// const CHARGING_STATION_MANAGER_ABI = [
//     {
//       "inputs": [],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "name": "OwnableInvalidOwner",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "OwnableUnauthorizedAccount",
//       "type": "error"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "stationId",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "availableSlots",
//           "type": "uint256"
//         }
//       ],
//       "name": "AvailabilityUpdated",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "stationId",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "name",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "location",
//           "type": "string"
//         }
//       ],
//       "name": "ChargingStationAdded",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "previousOwner",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "OwnershipTransferred",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "stationId",
//           "type": "uint256"
//         },
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "slotNumber",
//           "type": "uint256"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "user",
//           "type": "address"
//         }
//       ],
//       "name": "SlotOccupied",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "stationId",
//           "type": "uint256"
//         },
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "slotNumber",
//           "type": "uint256"
//         }
//       ],
//       "name": "SlotReleased",
//       "type": "event"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "_name",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "_location",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_latitude",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_longitude",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_totalSlots",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_chargingSpeed",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_pricePerKwh",
//           "type": "uint256"
//         },
//         {
//           "internalType": "string[]",
//           "name": "_amenities",
//           "type": "string[]"
//         }
//       ],
//       "name": "addChargingStation",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "chargingSlots",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "stationId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "slotNumber",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bool",
//           "name": "isOccupied",
//           "type": "bool"
//         },
//         {
//           "internalType": "address",
//           "name": "currentUser",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "startTime",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "estimatedEndTime",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "chargingStations",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "id",
//           "type": "uint256"
//         },
//         {
//           "internalType": "string",
//           "name": "name",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "location",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "latitude",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "longitude",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "totalSlots",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "availableSlots",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "chargingSpeed",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "pricePerKwh",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bool",
//           "name": "isActive",
//           "type": "bool"
//         },
//         {
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "createdAt",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "getAllChargingStations",
//       "outputs": [
//         {
//           "components": [
//             {
//               "internalType": "uint256",
//               "name": "id",
//               "type": "uint256"
//             },
//             {
//               "internalType": "string",
//               "name": "name",
//               "type": "string"
//             },
//             {
//               "internalType": "string",
//               "name": "location",
//               "type": "string"
//             },
//             {
//               "internalType": "uint256",
//               "name": "latitude",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "longitude",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "totalSlots",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "availableSlots",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "chargingSpeed",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "pricePerKwh",
//               "type": "uint256"
//             },
//             {
//               "internalType": "string[]",
//               "name": "amenities",
//               "type": "string[]"
//             },
//             {
//               "internalType": "bool",
//               "name": "isActive",
//               "type": "bool"
//             },
//             {
//               "internalType": "address",
//               "name": "operator",
//               "type": "address"
//             },
//             {
//               "internalType": "uint256",
//               "name": "createdAt",
//               "type": "uint256"
//             }
//           ],
//           "internalType": "struct ChargingStationManager.ChargingStation[]",
//           "name": "",
//           "type": "tuple[]"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_stationId",
//           "type": "uint256"
//         }
//       ],
//       "name": "getAvailableSlots",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_stationId",
//           "type": "uint256"
//         }
//       ],
//       "name": "getChargingStation",
//       "outputs": [
//         {
//           "components": [
//             {
//               "internalType": "uint256",
//               "name": "id",
//               "type": "uint256"
//             },
//             {
//               "internalType": "string",
//               "name": "name",
//               "type": "string"
//             },
//             {
//               "internalType": "string",
//               "name": "location",
//               "type": "string"
//             },
//             {
//               "internalType": "uint256",
//               "name": "latitude",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "longitude",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "totalSlots",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "availableSlots",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "chargingSpeed",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint256",
//               "name": "pricePerKwh",
//               "type": "uint256"
//             },
//             {
//               "internalType": "string[]",
//               "name": "amenities",
//               "type": "string[]"
//             },
//             {
//               "internalType": "bool",
//               "name": "isActive",
//               "type": "bool"
//             },
//             {
//               "internalType": "address",
//               "name": "operator",
//               "type": "address"
//             },
//             {
//               "internalType": "uint256",
//               "name": "createdAt",
//               "type": "uint256"
//             }
//           ],
//           "internalType": "struct ChargingStationManager.ChargingStation",
//           "name": "",
//           "type": "tuple"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "getCurrentStationId",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_stationId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_slotNumber",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_estimatedEndTime",
//           "type": "uint256"
//         }
//       ],
//       "name": "occupySlot",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "owner",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_stationId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_slotNumber",
//           "type": "uint256"
//         }
//       ],
//       "name": "releaseSlot",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "renounceOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "stationExists",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "transferOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_stationId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bool",
//           "name": "_isActive",
//           "type": "bool"
//         }
//       ],
//       "name": "updateStationAvailability",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     }
  
// ];

// // Contract addresses on Sonic Blaze testnet
// const CONTRACT_ADDRESSES = {
//   JOURNEY_PLANNER: "0x8F2ec925d70fA44d4C633Df2C1E8C368d3A270F2",
//   BOOKING_MANAGER: "0xB6d81503a0cF4C83f8590060E66e013B613fdE38",
//   VEHICLE_REGISTRY: "0x3E51C8DCD22Dba7118f53FA2eC12e3B593A1e66f",
//   CHARGING_STATION_MANAGER: "0x6913b4e587FceA0Fa01C87C6E3984aDeB72Ea82b"
// };

// // Sonic Blaze Testnet configuration
// const SONIC_BLAZE_TESTNET = {
//   chainId: '0xDEFE', // 1013 in decimal
//   chainName: 'Sonic Blaze Testnet',
//   nativeCurrency: {
//     name: 'Sonic',
//     symbol: 'S',
//     decimals: 18,
//   },
//   rpcUrls: ['https://rpc.blaze.soniclabs.com'],
//   blockExplorerUrls: ['https://testnet.sonicscan.org'],
// };


// const useWeb3 = () => {
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//   const [signer, setSigner] = useState<ethers.Signer | null>(null);
//   const [account, setAccount] = useState('');
//   const [chainId, setChainId] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const [contracts, setContracts] = useState<{
//     journeyPlanner?: ethers.Contract;
//     bookingManager?: ethers.Contract;
//     vehicleRegistry?: ethers.Contract;
//     chargingStationManager?: ethers.Contract;
//   }>({});

//   const connectWallet = async () => {
//     if (typeof window !== 'undefined' && window.ethereum) {
//       try {
//         // Request account access
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
        
//         // Check if we're on the correct network
//         const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        
//         if (currentChainId !== SONIC_BLAZE_TESTNET.chainId) {
//           try {
//             // Try to switch to Sonic Blaze Testnet
//             await window.ethereum.request({
//               method: 'wallet_switchEthereumChain',
//               params: [{ chainId: SONIC_BLAZE_TESTNET.chainId }],
//             });
//           } catch (switchError: any) {
//             // This error code indicates that the chain has not been added to MetaMask
//             if (switchError.code === 4902) {
//               try {
//                 await window.ethereum.request({
//                   method: 'wallet_addEthereumChain',
//                   params: [SONIC_BLAZE_TESTNET],
//                 });
//               } catch (addError) {
//                 console.error('Failed to add Sonic Blaze Testnet:', addError);
//                 throw new Error('Failed to add Sonic Blaze Testnet to MetaMask');
//               }
//             } else {
//               console.error('Failed to switch to Sonic Blaze Testnet:', switchError);
//               throw new Error('Failed to switch to Sonic Blaze Testnet');
//             }
//           }
//         }

//         const web3Provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await web3Provider.getSigner();
//         const address = await signer.getAddress();
//         const network = await web3Provider.getNetwork();

//         setProvider(web3Provider);
//         setSigner(signer);
//         setAccount(address);
//         setChainId(network.chainId.toString());
//         setIsConnected(true);

//         // Initialize contracts
//         const journeyPlannerContract = new ethers.Contract(
//           CONTRACT_ADDRESSES.JOURNEY_PLANNER,
//           JOURNEY_PLANNER_ABI,
//           signer
//         );

//         const bookingManagerContract = new ethers.Contract(
//           CONTRACT_ADDRESSES.BOOKING_MANAGER,
//           BOOKING_MANAGER_ABI,
//           signer
//         );

//         const vehicleRegistryContract = new ethers.Contract(
//           CONTRACT_ADDRESSES.VEHICLE_REGISTRY,
//           VEHICLE_REGISTRY_ABI,
//           signer
//         );

//         const chargingStationManagerContract = new ethers.Contract(
//           CONTRACT_ADDRESSES.CHARGING_STATION_MANAGER,
//           CHARGING_STATION_MANAGER_ABI,
//           signer
//         );

//         setContracts({
//           journeyPlanner: journeyPlannerContract,
//           bookingManager: bookingManagerContract,
//           vehicleRegistry: vehicleRegistryContract,
//           chargingStationManager: chargingStationManagerContract
//         });

//       } catch (error) {
//         console.error("Failed to connect wallet:", error);
//         alert("Failed to connect to MetaMask. Please make sure MetaMask is installed and try again.");
//       }
//     } else {
//       alert("Please install MetaMask to use this application!");
//     }
//   };

//   useEffect(() => {
//     const handleAccountsChanged = (accounts: string[]) => {
//       if (accounts.length === 0) {
//         setIsConnected(false);
//         setAccount('');
//         setContracts({});
//       } else {
//         setAccount(accounts[0]);
//       }
//     };

//     const handleChainChanged = (chainId: string) => {
//       setChainId(parseInt(chainId, 16).toString());
//       // Reload the page to reinitialize contracts
//       window.location.reload();
//     };

//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', handleAccountsChanged);
//       window.ethereum.on('chainChanged', handleChainChanged);
//     }

//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//         window.ethereum.removeListener('chainChanged', handleChainChanged);
//       }
//     };
//   }, []);

//   return { 
//     provider, 
//     signer, 
//     account, 
//     chainId, 
//     isConnected, 
//     contracts, 
//     connectWallet 
//   };
// };

// export default function SonicJourneyPlanner() {
//   const [origin, setOrigin] = useState('');
//   const [destination, setDestination] = useState('');
//   const [selectedVehicle, setSelectedVehicle] = useState('');
//   const [batteryLevel, setBatteryLevel] = useState(100);
//   const [journeyPlanned, setJourneyPlanned] = useState(false);
//   const [departureTime, setDepartureTime] = useState('');
//   const [departureDate, setDepartureDate] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [userVehicles, setUserVehicles] = useState<any[]>([]);
  
//   type JourneyData = {
//     id: number;
//     [key: string]: any;
//   };
  
//   const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  
//   type ChargingStop = {
//     stationId: number;
//     estimatedArrivalTime: number;
//     estimatedDepartureTime: number;
//     chargingDuration: number;
//     expectedChargeAmount: number;
//     isCompleted: boolean;
//   };
  
//   const [chargingStops, setChargingStops] = useState<ChargingStop[]>([]);

//   const { provider, signer, account, chainId, isConnected, contracts, connectWallet } = useWeb3();

//   // Mock data for charging stations
//   const mockChargingStations = [
//     {
//       id: 1,
//       name: 'Highway EnergyHub',
//       location: 'Highway NH45, Villupuram',
//       distance: 120,
//       availability: 2,
//       waitTime: 0,
//       chargingTime: 25,
//       arrivalTime: '12:45 PM',
//       departureTime: '1:10 PM',
//       amenities: ['Restroom', 'Café', 'WiFi']
//     },
//     {
//       id: 2,
//       name: 'GreenCharge Madurai',
//       location: 'Madurai Bypass Road',
//       distance: 320,
//       availability: 1,
//       waitTime: 15,
//       chargingTime: 30,
//       arrivalTime: '4:20 PM',
//       departureTime: '5:05 PM',
//       amenities: ['Restaurant', 'Shopping', 'Restroom']
//     }
//   ];

//   // Load user vehicles when connected
//   useEffect(() => {
//     const loadUserVehicles = async () => {
//       if (contracts.vehicleRegistry && account) {
//         try {
//           const vehicles = await contracts.vehicleRegistry.getUserVehicles(account);
//           setUserVehicles(vehicles);
//         } catch (error) {
//           console.error("Error loading user vehicles:", error);
//         }
//       }
//     };

//     loadUserVehicles();
//   }, [contracts.vehicleRegistry, account]);

//   const handlePlanJourney = async () => {
//     if (!isConnected) {
//       alert('Please connect your wallet first');
//       return;
//     }

//     if (!origin || !destination || !selectedVehicle || !departureTime || !departureDate) {
//       alert('Please fill in all the required fields');
//       return;
//     }

//     if (chainId !== '1013') {
//       alert('Please switch to Sonic Blaze Testnet');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       const departureDateTime = new Date(`${departureDate}T${departureTime}`);
//       const departureTimestamp = Math.floor(departureDateTime.getTime() / 1000);

//       const totalDistance = 500;
//       const estimatedTotalTime = 27000;
//       const userVehicleIndex = parseInt(selectedVehicle) || 0;
      
//       const chargingStopsData = mockChargingStations.map((station, index) => ({
//         stationId: station.id,
//         estimatedArrivalTime: departureTimestamp + (index + 1) * 14400,
//         estimatedDepartureTime: departureTimestamp + (index + 1) * 14400 + station.chargingTime * 60,
//         chargingDuration: station.chargingTime * 60,
//         expectedChargeAmount: 50,
//         isCompleted: false
//       }));

//       const chargingStationIds = mockChargingStations.map(station => station.id);

//       const tx = await contracts.journeyPlanner!.planJourney(
//         origin,
//         destination,
//         userVehicleIndex,
//         totalDistance,
//         estimatedTotalTime,
//         departureTimestamp,
//         chargingStationIds,
//         chargingStopsData
//       );

//       const receipt = await tx.wait();
//       console.log('Transaction confirmed:', receipt);
      
//       const currentJourneyId = await contracts.journeyPlanner!.getCurrentJourneyId();
//       const [journey, stops] = await contracts.journeyPlanner!.getJourney(currentJourneyId);
      
//       setJourneyData(journey);
//       setChargingStops(stops);
//       setJourneyPlanned(true);
      
//     } catch (error: any) {
//       console.error("Error planning journey:", error);
//       if (error.code === 4001) {
//         alert("Transaction was rejected by user");
//       } else {
//         alert("Failed to plan journey. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookChargingSlots = async () => {
//     if (!isConnected || !contracts.bookingManager || !journeyData) {
//       alert('Please connect your wallet and plan a journey first');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       for (let i = 0; i < chargingStops.length; i++) {
//         const stop = chargingStops[i];
        
//         const tx = await contracts.bookingManager.createBooking(
//           stop.stationId,
//           1,
//           journeyData.id,
//           stop.estimatedArrivalTime,
//           stop.chargingDuration
//         );
        
//         await tx.wait();
//       }
      
//       alert('All charging slots booked successfully!');
      
//     } catch (error: any) {
//       console.error("Error booking charging slots:", error);
//       if (error.code === 4001) {
//         alert("Transaction was rejected by user");
//       } else {
//         alert("Failed to book charging slots. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetJourney = () => {
//     setJourneyPlanned(false);
//     setJourneyData(null);
//     setChargingStops([]);
//   };

//   const formatTimestamp = (timestamp: number) => {
//     return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Sonic Journey Planner</h1>
//             <p className="text-sm text-gray-600 mt-1">Powered by Sonic Blaze Testnet</p>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {isConnected ? (
//               <div className="text-sm">
//                 <div className="text-green-600 font-medium">
//                   Connected: {account.slice(0, 6)}...{account.slice(-4)}
//                 </div>
//                 <div className="text-gray-500">
//                   Chain ID: {chainId}
//                 </div>
//               </div>
//             ) : (
//               <button
//                 onClick={connectWallet}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
//               >
//                 <Wallet className="h-4 w-4" />
//                 <span>Connect MetaMask</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {!isConnected ? (
//           <div className="bg-white rounded-xl shadow-md p-8 text-center">
//             <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
//             <p className="text-gray-600 mb-6">
//               Please connect your MetaMask wallet to use the Sonic Journey Planner on Sonic Blaze Testnet.
//             </p>
//             <button
//               onClick={connectWallet}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
//             >
//               Connect MetaMask
//             </button>
//           </div>
//         ) : !journeyPlanned ? (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <MapPin className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter starting point"
//                       value={origin}
//                       onChange={(e) => setOrigin(e.target.value)}
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <MapPin className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter destination"
//                       value={destination}
//                       onChange={(e) => setDestination(e.target.value)}
//                     />
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Calendar className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         type="date"
//                         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         value={departureDate}
//                         onChange={(e) => setDepartureDate(e.target.value)}
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Clock className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         type="time"
//                         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         value={departureTime}
//                         onChange={(e) => setDepartureTime(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//                <div className="space-y-6">
//                  <div>
//                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
//                    <select
//                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                      value={selectedVehicle}
//                      onChange={(e) => setSelectedVehicle(e.target.value)}
//                    >
//                      <option value="">Select Vehicle</option>
//                      <option value="0">Tesla Model 3</option>
//                      <option value="1">Nissan Leaf</option>
//                      <option value="2">BMW i3</option>
//                    </select>
//                  </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Current Battery Level</label>
//                   <div className="flex items-center space-x-4">
//                     <input
//                       type="range"
//                       min="0"
//                       max="100"
//                       value={batteryLevel}
//                       onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
//                       className="flex-1"
//                     />
//                     <div className="flex items-center space-x-1">
//                       <Battery className="h-5 w-5 text-green-500" />
//                       <span className="text-sm font-medium">{batteryLevel}%</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="pt-4">
//                   <button
//                     onClick={handlePlanJourney}
//                     disabled={loading || !isConnected}
//                     className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                   >
//                     {loading ? 'Planning Journey...' : 'Plan Journey'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">Journey Details</h2>
//                   <p className="text-gray-600 mt-1">
//                     {origin} to {destination} • {departureDate} at {departureTime}
//                   </p>
//                   {journeyData && (
//                     <p className="text-sm text-green-600 mt-1">
//                       Journey ID: {journeyData.id?.toString()}
//                     </p>
//                   )}
//                 </div>
//                 <button
//                   onClick={resetJourney}
//                   className="text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Edit Journey
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="lg:col-span-2">
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-64 flex items-center justify-center border border-blue-200">
//                     <div className="text-center">
//                       <Car className="h-12 w-12 text-blue-500 mx-auto mb-2" />
//                       <p className="text-blue-700 font-medium">Route Visualization</p>
//                       <p className="text-blue-600 text-sm">Map Integration Coming Soon</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3">Journey Summary</h3>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Distance:</span>
//                         <span className="font-medium">500 km</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Total Time:</span>
//                         <span className="font-medium">7h 30m</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Charging Stops:</span>
//                         <span className="font-medium">{chargingStops.length}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Battery Usage:</span>
//                         <span className="font-medium">85%</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="bg-blue-50 rounded-lg p-4">
//                     <h3 className="text-sm font-medium text-blue-800">Journey Optimization</h3>
//                     <p className="text-sm text-blue-700 mt-1">
//                       This route includes optimal charging stops to minimize your total travel time.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Charging Stops</h3>
//               <div className="space-y-4">
//                 {mockChargingStations.map((station, index) => {
//                   const contractStop = chargingStops[index];
//                   return (
//                     <div key={station.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <div className="flex items-center space-x-2 mb-2">
//                             <h4 className="font-semibold text-gray-900">{station.name}</h4>
//                             <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                               Available
//                             </span>
//                           </div>
//                           <p className="text-sm text-gray-600 mb-2">{station.location}</p>
                          
//                           <div className="grid grid-cols-2 gap-4 text-sm">
//                             <div>
//                               <span className="text-gray-500">Arrival:</span>
//                               <span className="ml-2 font-medium">
//                                 {contractStop ? formatTimestamp(contractStop.estimatedArrivalTime) : station.arrivalTime}
//                               </span>
//                             </div>
//                             <div>
//                               <span className="text-gray-500">Departure:</span>
//                               <span className="ml-2 font-medium">
//                                 {contractStop ? formatTimestamp(contractStop.estimatedDepartureTime) : station.departureTime}
//                               </span>
//                             </div>
//                             <div>
//                               <span className="text-gray-500">Charging Time:</span>
//                               <span className="ml-2 font-medium">{station.chargingTime} min</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-500">Wait Time:</span>
//                               <span className="ml-2 font-medium">{station.waitTime} min</span>
//                             </div>
//                           </div>
                          
//                           <div className="mt-3">
//                             <span className="text-xs text-gray-500">Amenities: </span>
//                             <div className="inline-flex flex-wrap gap-1 mt-1">
//                               {station.amenities.map((amenity, idx) => (
//                                 <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
//                                   {amenity}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
                        
//                         <div className="text-right ml-4">
//                           <div className="text-sm text-gray-600">Available Slots</div>
//                           <div className="text-2xl font-bold text-green-600">{station.availability}</div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             {station.distance} km away
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
            
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={handleBookChargingSlots}
//                 disabled={loading || !isConnected}
//                 className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-8 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center space-x-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span>Booking Slots...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Calendar className="h-4 w-4" />
//                     <span>Confirm & Book Charging Slots</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, Battery, MapPin, Clock, ChevronRight, Car, Wallet } from 'lucide-react';
import { ethers } from 'ethers';

// Contract ABIs - ADD YOUR ABI ARRAYS HERE
const JOURNEY_PLANNER_ABI = [
  {
      "inputs": [
        {
          "internalType": "address",
          "name": "_vehicleRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_chargingStationManager",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "journeyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stationId",
          "type": "uint256"
        }
      ],
      "name": "ChargingStopAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "journeyId",
          "type": "uint256"
        }
      ],
      "name": "JourneyCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "journeyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "origin",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "destination",
          "type": "string"
        }
      ],
      "name": "JourneyPlanned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "journeyId",
          "type": "uint256"
        }
      ],
      "name": "JourneyStarted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vehicleId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_currentBatteryLevel",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_totalDistance",
          "type": "uint256"
        }
      ],
      "name": "calculateOptimalRoute",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "recommendedStations",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "chargingStationManager",
      "outputs": [
        {
          "internalType": "contract ChargingStationManager",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_journeyId",
          "type": "uint256"
        }
      ],
      "name": "completeJourney",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentJourneyId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_journeyId",
          "type": "uint256"
        }
      ],
      "name": "getJourney",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "origin",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "destination",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "vehicleId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "userVehicleIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "initialBatteryLevel",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalDistance",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "estimatedTotalTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "departureTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "estimatedArrivalTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "chargingStationIds",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "enum JourneyPlanner.JourneyStatus",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct JourneyPlanner.Journey",
          "name": "",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "stationId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "estimatedArrivalTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "estimatedDepartureTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "chargingDuration",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "expectedChargeAmount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isCompleted",
              "type": "bool"
            }
          ],
          "internalType": "struct JourneyPlanner.ChargingStop[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getUserJourneys",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "journeyChargingStops",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "stationId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "estimatedArrivalTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "estimatedDepartureTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "chargingDuration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "expectedChargeAmount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isCompleted",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "journeys",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "origin",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "destination",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "vehicleId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "userVehicleIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "initialBatteryLevel",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalDistance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "estimatedTotalTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "departureTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "estimatedArrivalTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "enum JourneyPlanner.JourneyStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_origin",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_destination",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_userVehicleIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_totalDistance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_estimatedTotalTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_departureTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_chargingStationIds",
          "type": "uint256[]"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "stationId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "estimatedArrivalTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "estimatedDepartureTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "chargingDuration",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "expectedChargeAmount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isCompleted",
              "type": "bool"
            }
          ],
          "internalType": "struct JourneyPlanner.ChargingStop[]",
          "name": "_chargingStops",
          "type": "tuple[]"
        }
      ],
      "name": "planJourney",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_journeyId",
          "type": "uint256"
        }
      ],
      "name": "startJourney",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userJourneys",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vehicleRegistry",
      "outputs": [
        {
          "internalType": "contract VehicleRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  // ADD YOUR JOURNEY PLANNER CONTRACT ABI HERE
  // Example: { "inputs": [...], "name": "planJourney", "outputs": [...], "stateMutability": "nonpayable", "type": "function" }
];

const BOOKING_MANAGER_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_chargingStationManager",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bookingId",
          "type": "uint256"
        }
      ],
      "name": "BookingCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bookingId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalCost",
          "type": "uint256"
        }
      ],
      "name": "BookingCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bookingId",
          "type": "uint256"
        }
      ],
      "name": "BookingConfirmed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bookingId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stationId",
          "type": "uint256"
        }
      ],
      "name": "BookingCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bookingId",
          "type": "uint256"
        }
      ],
      "name": "BookingStarted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bookingId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PaymentReceived",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "bookings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "stationId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "slotNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "journeyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "scheduledStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "scheduledEndTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "estimatedChargingDuration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bookedAt",
          "type": "uint256"
        },
        {
          "internalType": "enum BookingManager.BookingStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "actualStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "actualEndTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalCost",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isPaid",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookingId",
          "type": "uint256"
        }
      ],
      "name": "cancelBooking",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "chargingStationManager",
      "outputs": [
        {
          "internalType": "contract ChargingStationManager",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookingId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_energyConsumed",
          "type": "uint256"
        }
      ],
      "name": "completeCharging",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookingId",
          "type": "uint256"
        }
      ],
      "name": "confirmBooking",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_stationId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_slotNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_journeyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_scheduledStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_estimatedChargingDuration",
          "type": "uint256"
        }
      ],
      "name": "createBooking",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookingId",
          "type": "uint256"
        }
      ],
      "name": "getBooking",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "stationId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "slotNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "journeyId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "scheduledStartTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "scheduledEndTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "estimatedChargingDuration",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "bookedAt",
              "type": "uint256"
            },
            {
              "internalType": "enum BookingManager.BookingStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "actualStartTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "actualEndTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalCost",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isPaid",
              "type": "bool"
            }
          ],
          "internalType": "struct BookingManager.Booking",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentBookingId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_journeyId",
          "type": "uint256"
        }
      ],
      "name": "getJourneyBookings",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getUserBookings",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_stationId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_slotNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endTime",
          "type": "uint256"
        }
      ],
      "name": "isSlotAvailable",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "journeyBookings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookingId",
          "type": "uint256"
        }
      ],
      "name": "startCharging",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "stationSlotBookings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userBookings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  // ADD YOUR BOOKING MANAGER CONTRACT ABI HERE
  // Example: { "inputs": [...], "name": "createBooking", "outputs": [...], "stateMutability": "nonpayable", "type": "function" }
];

const VEHICLE_REGISTRY_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "userVehicleIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "batteryLevel",
          "type": "uint256"
        }
      ],
      "name": "BatteryLevelUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "vehicleId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "licensePlate",
          "type": "string"
        }
      ],
      "name": "UserVehicleRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "vehicleId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "model",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "brand",
          "type": "string"
        }
      ],
      "name": "VehicleAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_model",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_brand",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_batteryCapacity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_range",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_chargingSpeed",
          "type": "uint256"
        }
      ],
      "name": "addVehicle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentVehicleId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalVehicles",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getUserVehicles",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "vehicleId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "licensePlate",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "currentBatteryLevel",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastUpdated",
              "type": "uint256"
            }
          ],
          "internalType": "struct VehicleRegistry.UserVehicle[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vehicleId",
          "type": "uint256"
        }
      ],
      "name": "getVehicle",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "model",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "brand",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "batteryCapacity",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "range",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "chargingSpeed",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct VehicleRegistry.Vehicle",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vehicleId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_licensePlate",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_currentBatteryLevel",
          "type": "uint256"
        }
      ],
      "name": "registerUserVehicle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_userVehicleIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_batteryLevel",
          "type": "uint256"
        }
      ],
      "name": "updateBatteryLevel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userVehicles",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "vehicleId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "licensePlate",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "currentBatteryLevel",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastUpdated",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vehicleExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vehicles",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "model",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "brand",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "batteryCapacity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "range",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "chargingSpeed",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  // ADD YOUR VEHICLE REGISTRY CONTRACT ABI HERE
  // Example: { "inputs": [...], "name": "getUserVehicles", "outputs": [...], "stateMutability": "view", "type": "function" }
];

const CHARGING_STATION_MANAGER_ABI = [
      {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stationId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "availableSlots",
          "type": "uint256"
        }
      ],
      "name": "AvailabilityUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stationId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "location",
          "type": "string"
        }
      ],
      "name": "ChargingStationAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stationId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "slotNumber",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "SlotOccupied",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stationId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "slotNumber",
          "type": "uint256"
        }
      ],
      "name": "SlotReleased",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_location",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_latitude",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_longitude",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_totalSlots",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_chargingSpeed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_pricePerKwh",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "_amenities",
          "type": "string[]"
        }
      ],
      "name": "addChargingStation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "chargingSlots",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "stationId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "slotNumber",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isOccupied",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "currentUser",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "estimatedEndTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "chargingStations",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "latitude",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "longitude",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalSlots",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "availableSlots",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "chargingSpeed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "pricePerKwh",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllChargingStations",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "location",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "latitude",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "longitude",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalSlots",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "availableSlots",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "chargingSpeed",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "pricePerKwh",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "amenities",
              "type": "string[]"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct ChargingStationManager.ChargingStation[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_stationId",
          "type": "uint256"
        }
      ],
      "name": "getAvailableSlots",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_stationId",
          "type": "uint256"
        }
      ],
      "name": "getChargingStation",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "location",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "latitude",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "longitude",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalSlots",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "availableSlots",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "chargingSpeed",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "pricePerKwh",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "amenities",
              "type": "string[]"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct ChargingStationManager.ChargingStation",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentStationId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_stationId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_slotNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_estimatedEndTime",
          "type": "uint256"
        }
      ],
      "name": "occupySlot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_stationId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_slotNumber",
          "type": "uint256"
        }
      ],
      "name": "releaseSlot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "stationExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_stationId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_isActive",
          "type": "bool"
        }
      ],
      "name": "updateStationAvailability",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  // ADD YOUR CHARGING STATION MANAGER CONTRACT ABI HERE
  // Example: { "inputs": [...], "name": "getCurrentStationId", "outputs": [...], "stateMutability": "view", "type": "function" }
];

// Contract addresses on Sonic Blaze testnet - UPDATE THESE WITH YOUR DEPLOYED CONTRACT ADDRESSES
const CONTRACT_ADDRESSES = {
  JOURNEY_PLANNER: "0x8F2ec925d70fA44d4C633Df2C1E8C368d3A270F2", // UPDATE THIS
  BOOKING_MANAGER: "0xB6d81503a0cF4C83f8590060E66e013B613fdE38", // UPDATE THIS
  VEHICLE_REGISTRY: "0x3E51C8DCD22Dba7118f53FA2eC12e3B593A1e66f", // UPDATE THIS
  CHARGING_STATION_MANAGER: "0x6913b4e587FceA0Fa01C87C6E3984aDeB72Ea82b" // UPDATE THIS
};

// Sonic Blaze Testnet configuration
const SONIC_BLAZE_TESTNET = {
  chainId: '0xDEDE', // 57054 in decimal converted to hex
  chainName: 'Sonic Blaze Testnet',
  nativeCurrency: {
    name: 'Sonic',
    symbol: 'S',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.blaze.soniclabs.com'],
  blockExplorerUrls: ['https://testnet.sonicscan.org'],
};

// Declare window.ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}

const useWeb3 = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [contracts, setContracts] = useState<{
    journeyPlanner?: ethers.Contract;
    bookingManager?: ethers.Contract;
    vehicleRegistry?: ethers.Contract;
    chargingStationManager?: ethers.Contract;
  }>({});

  const connectWallet = async () => {
    setConnectionError('');
    
    if (!window.ethereum) {
      setConnectionError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      console.log('Requesting account access...');
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length === 0) {
        setConnectionError('No accounts found. Please unlock MetaMask.');
        return;
      }

      console.log('Account connected:', accounts[0]);
      
      // Get current chain ID
      const currentChainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      console.log('Current chain ID:', currentChainId);
      console.log('Required chain ID:', SONIC_BLAZE_TESTNET.chainId);
      
      // Check if we're on the correct network
      if (currentChainId !== SONIC_BLAZE_TESTNET.chainId) {
        console.log('Wrong network, attempting to switch...');
        
        try {
          // Try to switch to Sonic Blaze Testnet
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SONIC_BLAZE_TESTNET.chainId }],
          });
          
          console.log('Successfully switched network');
          
        } catch (switchError: any) {
          console.log('Switch error:', switchError);
          
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            console.log('Network not found, attempting to add...');
            
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [SONIC_BLAZE_TESTNET],
              });
              
              console.log('Successfully added network');
              
            } catch (addError: any) {
              console.error('Failed to add Sonic Blaze Testnet:', addError);
              setConnectionError('Failed to add Sonic Blaze Testnet to MetaMask. Please add it manually.');
              return;
            }
          } else {
            console.error('Failed to switch to Sonic Blaze Testnet:', switchError);
            setConnectionError('Failed to switch to Sonic Blaze Testnet. Please switch manually.');
            return;
          }
        }
      }

      // Initialize provider and signer
      console.log('Initializing Web3 provider...');
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();
      const network = await web3Provider.getNetwork();

      console.log('Connected address:', address);
      console.log('Network:', network);

      setProvider(web3Provider);
      setSigner(signer);
      setAccount(address);
      setChainId(network.chainId.toString());
      setIsConnected(true);

      // Test contract initialization
      await initializeContracts(signer);

    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      
      if (error.code === 4001) {
        setConnectionError('Connection rejected by user.');
      } else if (error.code === -32002) {
        setConnectionError('Connection request already pending. Please check MetaMask.');
      } else {
        setConnectionError(`Failed to connect: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const initializeContracts = async (signer: ethers.Signer) => {
    try {
      console.log('Initializing contracts...');
      
      // Test if ABIs are properly loaded
      if (!JOURNEY_PLANNER_ABI || JOURNEY_PLANNER_ABI.length === 0) {
        console.warn('Journey Planner ABI is empty. Please add your ABI array.');
      }

      // Initialize contracts only if ABIs are available
      const contractInstances: any = {};

      if (JOURNEY_PLANNER_ABI && JOURNEY_PLANNER_ABI.length > 0) {
        contractInstances.journeyPlanner = new ethers.Contract(
          CONTRACT_ADDRESSES.JOURNEY_PLANNER,
          JOURNEY_PLANNER_ABI,
          signer
        );
        console.log('Journey Planner contract initialized');
      }

      if (BOOKING_MANAGER_ABI && BOOKING_MANAGER_ABI.length > 0) {
        contractInstances.bookingManager = new ethers.Contract(
          CONTRACT_ADDRESSES.BOOKING_MANAGER,
          BOOKING_MANAGER_ABI,
          signer
        );
        console.log('Booking Manager contract initialized');
      }

      if (VEHICLE_REGISTRY_ABI && VEHICLE_REGISTRY_ABI.length > 0) {
        contractInstances.vehicleRegistry = new ethers.Contract(
          CONTRACT_ADDRESSES.VEHICLE_REGISTRY,
          VEHICLE_REGISTRY_ABI,
          signer
        );
        console.log('Vehicle Registry contract initialized');
      }

      if (CHARGING_STATION_MANAGER_ABI && CHARGING_STATION_MANAGER_ABI.length > 0) {
        contractInstances.chargingStationManager = new ethers.Contract(
          CONTRACT_ADDRESSES.CHARGING_STATION_MANAGER,
          CHARGING_STATION_MANAGER_ABI,
          signer
        );
        console.log('Charging Station Manager contract initialized');
      }

      setContracts(contractInstances);
      
      // Test contract connection
      await testContractConnection(contractInstances);
      
    } catch (error) {
      console.error('Error initializing contracts:', error);
      setConnectionError('Failed to initialize smart contracts. Please check contract addresses and ABIs.');
    }
  };

  const testContractConnection = async (contractInstances: any) => {
    try {
      // Test each contract connection
      const tests = [];
      
      if (contractInstances.journeyPlanner) {
        tests.push(
          contractInstances.journeyPlanner.getCurrentJourneyId()
            .then(() => console.log('✅ Journey Planner contract connected'))
            .catch((e: any) => console.log('❌ Journey Planner contract error:', e.message))
        );
      }

      if (contractInstances.vehicleRegistry) {
        tests.push(
          contractInstances.vehicleRegistry.getUserVehicles(await contractInstances.vehicleRegistry.runner?.getAddress())
            .then(() => console.log('✅ Vehicle Registry contract connected'))
            .catch((e: any) => console.log('❌ Vehicle Registry contract error:', e.message))
        );
      }

      if (contractInstances.chargingStationManager) {
        tests.push(
          contractInstances.chargingStationManager.getCurrentStationId()
            .then(() => console.log('✅ Charging Station Manager contract connected'))
            .catch((e: any) => console.log('❌ Charging Station Manager contract error:', e.message))
        );
      }

      // Wait for all tests to complete
      await Promise.allSettled(tests);
      
    } catch (error) {
      console.error('Contract connection test failed:', error);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount('');
    setChainId('');
    setIsConnected(false);
    setContracts({});
    setConnectionError('');
  };

  // Event listeners for account and network changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        // Reinitialize contracts with new account
        if (provider) {
          provider.getSigner().then(newSigner => {
            setSigner(newSigner);
            initializeContracts(newSigner);
          });
        }
      }
    };

    const handleChainChanged = (chainId: string) => {
      console.log('Chain changed to:', chainId);
      const decimalChainId = parseInt(chainId, 16).toString();
      setChainId(decimalChainId);
      
      // Check if still on correct network
      if (chainId !== SONIC_BLAZE_TESTNET.chainId) {
        setConnectionError('Please switch back to Sonic Blaze Testnet');
        setIsConnected(false);
      } else {
        setConnectionError('');
        if (account) {
          setIsConnected(true);
        }
      }
    };

    const handleDisconnect = () => {
      console.log('Wallet disconnected');
      disconnectWallet();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            console.log('Already connected to:', accounts[0]);
            connectWallet();
          }
        })
        .catch(console.error);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [account, provider]);

  return { 
    provider, 
    signer, 
    account, 
    chainId, 
    isConnected, 
    contracts, 
    connectWallet,
    disconnectWallet,
    connectionError
  };
};

export default function SonicJourneyPlanner() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [journeyPlanned, setJourneyPlanned] = useState(false);
  const [departureTime, setDepartureTime] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [userVehicles, setUserVehicles] = useState<any[]>([]);
  
  type JourneyData = {
    id: number;
    [key: string]: any;
  };
  
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  
  type ChargingStop = {
    stationId: number;
    estimatedArrivalTime: number;
    estimatedDepartureTime: number;
    chargingDuration: number;
    expectedChargeAmount: number;
    isCompleted: boolean;
  };
  
  const [chargingStops, setChargingStops] = useState<ChargingStop[]>([]);

  const { 
    provider, 
    signer, 
    account, 
    chainId, 
    isConnected, 
    contracts, 
    connectWallet,
    disconnectWallet,
    connectionError
  } = useWeb3();

  // Mock data for charging stations
  const mockChargingStations = [
    {
      id: 1,
      name: 'Highway EnergyHub',
      location: 'Highway NH45, Villupuram',
      distance: 120,
      availability: 2,
      waitTime: 0,
      chargingTime: 25,
      arrivalTime: '12:45 PM',
      departureTime: '1:10 PM',
      amenities: ['Restroom', 'Café', 'WiFi']
    },
    {
      id: 2,
      name: 'GreenCharge Madurai',
      location: 'Madurai Bypass Road',
      distance: 320,
      availability: 1,
      waitTime: 15,
      chargingTime: 30,
      arrivalTime: '4:20 PM',
      departureTime: '5:05 PM',
      amenities: ['Restaurant', 'Shopping', 'Restroom']
    }
  ];

  // Load user vehicles when connected
  useEffect(() => {
    const loadUserVehicles = async () => {
      if (contracts.vehicleRegistry && account) {
        try {
          console.log('Loading user vehicles for account:', account);
          const vehicles = await contracts.vehicleRegistry.getUserVehicles(account);
          console.log('User vehicles loaded:', vehicles);
          setUserVehicles(vehicles);
        } catch (error) {
          console.error("Error loading user vehicles:", error);
        }
      }
    };

    if (isConnected) {
      loadUserVehicles();
    }
  }, [contracts.vehicleRegistry, account, isConnected]);

  const handlePlanJourney = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!contracts.journeyPlanner) {
      alert('Journey Planner contract not available. Please ensure ABI is loaded.');
      return;
    }

    if (!origin || !destination || !selectedVehicle || !departureTime || !departureDate) {
      alert('Please fill in all the required fields');
      return;
    }

    if (chainId !== '57054') {
      alert('Please switch to Sonic Blaze Testnet (Chain ID: 57054)');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Planning journey...');
      
      const departureDateTime = new Date(`${departureDate}T${departureTime}`);
      const departureTimestamp = Math.floor(departureDateTime.getTime() / 1000);

      const totalDistance = 500;
      const estimatedTotalTime = 27000;
      const userVehicleIndex = parseInt(selectedVehicle) || 0;
      
      const chargingStopsData = mockChargingStations.map((station, index) => ({
        stationId: station.id,
        estimatedArrivalTime: departureTimestamp + (index + 1) * 14400,
        estimatedDepartureTime: departureTimestamp + (index + 1) * 14400 + station.chargingTime * 60,
        chargingDuration: station.chargingTime * 60,
        expectedChargeAmount: 50,
        isCompleted: false
      }));

      const chargingStationIds = mockChargingStations.map(station => station.id);

      console.log('Calling planJourney with params:', {
        origin,
        destination,
        userVehicleIndex,
        totalDistance,
        estimatedTotalTime,
        departureTimestamp,
        chargingStationIds,
        chargingStopsData
      });

      const tx = await contracts.journeyPlanner.planJourney(
        origin,
        destination,
        userVehicleIndex,
        totalDistance,
        estimatedTotalTime,
        departureTimestamp,
        chargingStationIds,
        chargingStopsData
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Get journey data
      const currentJourneyId = await contracts.journeyPlanner.getCurrentJourneyId();
      console.log('Current journey ID:', currentJourneyId.toString());
      
      const [journey, stops] = await contracts.journeyPlanner.getJourney(currentJourneyId);
      console.log('Journey data:', journey);
      console.log('Charging stops:', stops);
      
      setJourneyData(journey);
      setChargingStops(stops);
      setJourneyPlanned(true);
      
    } catch (error: any) {
      console.error("Error planning journey:", error);
      
      if (error.code === 4001) {
        alert("Transaction was rejected by user");
      } else if (error.code === -32603) {
        alert("Internal error. Please check your contract address and ABI.");
      } else {
        alert(`Failed to plan journey: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookChargingSlots = async () => {
    if (!isConnected || !contracts.bookingManager || !journeyData) {
      alert('Please connect your wallet and plan a journey first');
      return;
    }

    if (!contracts.bookingManager) {
      alert('Booking Manager contract not available. Please ensure ABI is loaded.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Booking charging slots...');
      
      for (let i = 0; i < chargingStops.length; i++) {
        const stop = chargingStops[i];
        
        console.log(`Booking slot ${i + 1}:`, {
          stationId: stop.stationId,
          slotNumber: 1,
          journeyId: journeyData.id,
          scheduledStartTime: stop.estimatedArrivalTime,
          estimatedChargingDuration: stop.chargingDuration
        });
        
        const tx = await contracts.bookingManager.createBooking(
          stop.stationId,
          1, // slot number
          journeyData.id,
          stop.estimatedArrivalTime,
          stop.chargingDuration
        );
        
        console.log(`Booking ${i + 1} transaction:`, tx.hash);
        await tx.wait();
        console.log(`Booking ${i + 1} confirmed`);
      }
      
      alert('All charging slots booked successfully!');
      
    } catch (error: any) {
      console.error("Error booking charging slots:", error);
      
      if (error.code === 4001) {
        alert("Transaction was rejected by user");
      } else {
        alert(`Failed to book charging slots: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetJourney = () => {
    setJourneyPlanned(false);
    setJourneyData(null);
    setChargingStops([]);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sonic Journey Planner</h1>
            <p className="text-sm text-gray-600 mt-1">Powered by Sonic Blaze Testnet</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="text-sm">
                <div className="text-green-600 font-medium">
                  Connected: {formatAddress(account)}
                </div>
                <div className="text-gray-500">
                  Chain ID: {chainId}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-red-600 hover:text-red-800 text-xs mt-1"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect MetaMask</span>
              </button>
            )}
          </div>
        </div>

        {/* Connection Error Display */}
        {connectionError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="text-red-800">
                <strong>Connection Error:</strong> {connectionError}
              </div>
            </div>
          </div>
        )}

        {/* Network Info */}
        {isConnected && chainId !== '57054' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="text-yellow-800">
                <strong>Wrong Network:</strong> Please switch to Sonic Blaze Testnet (Chain ID: 57054)
              </div>
            </div>
          </div>
        )}

        {/* Contract Status */}
        {isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="text-blue-800 text-sm">
              <strong>Contract Status:</strong>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>Journey Planner: {contracts.journeyPlanner ? '✅ Loaded' : '❌ Not Loaded'}</div>
                <div>Booking Manager: {contracts.bookingManager ? '✅ Loaded' : '❌ Not Loaded'}</div>
                <div>Vehicle Registry: {contracts.vehicleRegistry ? '✅ Loaded' : '❌ Not Loaded'}</div>
                <div>Charging Station: {contracts.chargingStationManager ? '✅ Loaded' : '❌ Not Loaded'}</div>
              </div>
            </div>
          </div>
        )}

        {!isConnected ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              Please connect your MetaMask wallet to use the Sonic Journey Planner on Sonic Blaze Testnet.
            </p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Connect MetaMask
            </button>
          </div>
        ) : !journeyPlanned ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter starting point"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                   <select
                     className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                     value={selectedVehicle}
                     onChange={(e) => setSelectedVehicle(e.target.value)}
                   >
                     <option value="">Select Vehicle</option>
                     <option value="0">Tesla Model 3</option>
                     <option value="1">Nissan Leaf</option>
                     <option value="2">BMW i3</option>
                   </select>
                 </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Battery Level</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={batteryLevel}
                      onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-1">
                      <Battery className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">{batteryLevel}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handlePlanJourney}
                    disabled={loading || !isConnected}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {loading ? 'Planning Journey...' : 'Plan Journey'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Journey Details</h2>
                  <p className="text-gray-600 mt-1">
                    {origin} to {destination} • {departureDate} at {departureTime}
                  </p>
                  {journeyData && (
                    <p className="text-sm text-green-600 mt-1">
                      Journey ID: {journeyData.id?.toString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={resetJourney}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit Journey
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-64 flex items-center justify-center border border-blue-200">
                    <div className="text-center">
                      <Car className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-blue-700 font-medium">Route Visualization</p>
                      <p className="text-blue-600 text-sm">Map Integration Coming Soon</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Journey Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium">500 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Time:</span>
                        <span className="font-medium">7h 30m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Charging Stops:</span>
                        <span className="font-medium">{chargingStops.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Battery Usage:</span>
                        <span className="font-medium">85%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800">Journey Optimization</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      This route includes optimal charging stops to minimize your total travel time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Charging Stops</h3>
              <div className="space-y-4">
                {mockChargingStations.map((station, index) => {
                  const contractStop = chargingStops[index];
                  return (
                    <div key={station.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{station.name}</h4>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Available
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{station.location}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Arrival:</span>
                              <span className="ml-2 font-medium">
                                {contractStop ? formatTimestamp(contractStop.estimatedArrivalTime) : station.arrivalTime}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Departure:</span>
                              <span className="ml-2 font-medium">
                                {contractStop ? formatTimestamp(contractStop.estimatedDepartureTime) : station.departureTime}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Charging Time:</span>
                              <span className="ml-2 font-medium">{station.chargingTime} min</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Wait Time:</span>
                              <span className="ml-2 font-medium">{station.waitTime} min</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <span className="text-xs text-gray-500">Amenities: </span>
                            <div className="inline-flex flex-wrap gap-1 mt-1">
                              {station.amenities.map((amenity, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="text-sm text-gray-600">Available Slots</div>
                          <div className="text-2xl font-bold text-green-600">{station.availability}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {station.distance} km away
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleBookChargingSlots}
                disabled={loading || !isConnected}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-8 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Booking Slots...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    <span>Confirm & Book Charging Slots</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
}

