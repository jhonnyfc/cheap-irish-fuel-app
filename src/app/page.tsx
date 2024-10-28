"use client";

import { useState, useMemo } from "react";
import FuelStationCard from "@/shared/components/cardFuelInfo";
import SearchComponent from "@/shared/components/SearchComponent";
import petrolStationsData from "@/shared/constants/petrolStationsData.json";

interface Location {
  lat: number | null;
  lon: number | null;
}

interface Station {
  stationName: string;
  latitude: number;
  longitude: number;
  countyName: string | null;
  distance?: number | null;
  dieselPrice: number | null;
  unleadedPrice: number | null;
  dateUpdated?: string;
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (angle: number) => (angle * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [location, setLocation] = useState<Location>({ lat: null, lon: null });
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("distance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const updateDate = new Date(petrolStationsData.updateDate);
  const formattedDate = updateDate.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const setCityNameFromLatLong = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      const city =
        data.display_name ||
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.city_district;
      setCity(city || "Unknown Location");
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  // Get current location using the Geolocation API
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          setCityNameFromLatLong(latitude, longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const filteredStations = useMemo(() => {
    const stationsWithDistance = petrolStationsData.stations.map((station) => {
      const distance =
        location.lat && location.lon
          ? haversineDistance(
              location.lat,
              location.lon,
              station.latitude,
              station.longitude
            )
          : null;
      return { ...station, distance };
    });

    // Filter by distance
    const filtered = stationsWithDistance.filter((station) => {
      if (distanceFilter === null || station.distance === null) return true;
      return station.distance <= distanceFilter;
    });

    // Sort by the selected criteria and order
    const sorted = filtered.sort((a, b) => {
      let aValue: number | null = null;
      let bValue: number | null = null;

      if (sortBy === "dieselPrice") {
        aValue = a.dieselPrice;
        bValue = b.dieselPrice;
      } else if (sortBy === "unleadedPrice") {
        aValue = a.unleadedPrice;
        bValue = b.unleadedPrice;
      } else if (sortBy === "distance") {
        aValue = a.distance;
        bValue = b.distance;
      }

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [location, distanceFilter, sortBy, sortOrder]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 mt-5">
        Last updated: {formattedDate}
      </p>

      <SearchComponent
        city={city}
        location={location}
        setCity={setCity}
        setLocation={setLocation}
        onGetCurrentLocation={handleCurrentLocation}
      />

      <div className="flex flex-col space-y-4 p-6 mt-1 mb-2">
        {/* Distance Filter */}
        <div className="flex items-center space-x-3">
          <label
            htmlFor="distanceFilter"
            className="text-lg font-semibold text-gray-700"
          >
            Filter by Distance:
          </label>
          <select
            id="distanceFilter"
            className="border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={distanceFilter || ""}
            onChange={(e) =>
              setDistanceFilter(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
          >
            <option value="">All</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="13">13 km</option>
            <option value="20">20 km</option>
            <option value="30">30 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
          </select>
        </div>

        {/* Sort By and Sort Order */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <label
              htmlFor="sortBy"
              className="text-lg font-semibold text-gray-700"
            >
              Sort By:
            </label>
            <select
              id="sortBy"
              className="border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="distance">Distance</option>
              <option value="dieselPrice">Diesel Price</option>
              <option value="unleadedPrice">Unleaded Price</option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center space-x-2 p-2 border rounded-md bg-blue-500 text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOrder === "asc" ? (
              <>
                <span>Ascending</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>Descending</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredStations.map((station: Station, index: number) => (
          <FuelStationCard
            key={index}
            name={station.stationName}
            city={station.countyName ?? "---"}
            distance={station.distance ?? "---"}
            mapsLink={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}
            fuelPrices={[
              {
                type: "Diesel",
                price: station.dieselPrice ?? "---",
              },
              {
                type: "Unleaded",
                price: station.unleadedPrice ?? "---",
              },
            ]}
            updatedDate={station.dateUpdated}
          />
        ))}
      </div>
    </div>
  );
}
