// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Structs {
    // User struct to store user information
    struct User {
        address walletAddress;
        string name;
        string email;
        bool isRegistered;
        uint256 registrationTime;
        uint256 tokenBalance;
        uint256 reputation;
    }

    // Charging station struct
    struct Station {
        uint256 id;
        address owner;
        string stationType; // Municipal, Commercial, Residential
        string name;
        string metadata; // JSON string with additional details
        bool isActive;
        uint256 registrationTime;
        uint256 reputation;
        Charger[] chargers;
        uint256 totalRevenue;
    }

    // Charger struct
    struct Charger {
        uint256 id;
        uint256 stationId;
        string chargerType; // Fast, Medium, Slow
        uint256 powerOutput; // in kW
        uint256 pricePerKWh;
        bool isAvailable;
    }

    // Booking struct
    struct Booking {
        uint256 id;
        address user;
        uint256 stationId;
        uint256 chargerId;
        uint256 startTime;
        uint256 endTime;
        uint256 estimatedDuration; // in minutes
        bool isActive;
        bool isCompleted;
    }

    // Charging session struct
    struct ChargingSession {
        uint256 id;
        address user;
        uint256 stationId;
        uint256 chargerId;
        uint256 startTime;
        uint256 endTime;
        uint256 energyConsumed; // in Wh
        uint256 totalCost;
        bool isActive;
        bool isCompleted;
        bool isPaid;
    }

    // Queue entry struct
    struct QueueEntry {
        address user;
        uint256 estimatedDuration;
        uint256 joinTime;
        bool isActive;
    }

    // Route planning struct
    struct Route {
        string startLocation;
        string endLocation;
        string vehicleModel;
        uint256 batteryPercentage;
        uint256 totalDistance;
        uint256[] recommendedStations;
    }
}