"use client";

import { useState, useMemo } from "react";
import FuelStationCard from "@/shared/components/cardFuelInfo";
import SearchComponent from "@/shared/components/SearchComponent";
import petrolStationsData from "@/shared/constants/petrolStationsData.json";
import { Location } from "@/shared/models/Location";
import { haversineDistance } from "@/app/utils/haversineDistance";
import { getCurrentLocationName } from "@/app/repository/getCurrentLocationName";
import { getCurrentLocation } from "@/app/services/getCurrentLocationService";

interface Station {
  stationName: string;
  latitude: number;
  longitude: number;
  countyName?: string | null;
  distance?: number | null;
  dieselPrice: number | null;
  unleadedPrice: number | null;
  dateUpdated?: string | null;
}

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [location, setLocation] = useState<Location>({ lat: null, lon: null });
  const [distanceFilter, setDistanceFilter] = useState<number | null>(10);
  const [sortBy, setSortBy] = useState<string>("distance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const updateDate = new Date(petrolStationsData.updateDate);
  const formattedDate = updateDate.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleCurrentLocation = async () => {
    try {
      const { lat, lon } = await getCurrentLocation();
      if (!lat || !lon) {
        return;
      }
      const currentLocationName = await getCurrentLocationName(lat, lon);
      setLocation({ lat, lon });
      setCity(currentLocationName);
    } catch {}
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

    const filtered = stationsWithDistance.filter((station) => {
      if (distanceFilter === null || station.distance === null) return true;
      return station.distance <= distanceFilter;
    });

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
    <div className="flex flex-col items-center h-full">
      <p className="text-sm text-gray-600 mt-5">
        Last updated: {formattedDate}
      </p>

      <h1 className="text-2xl font-bold mt-4">Cheap Irish Fuel</h1>

      <SearchComponent
        city={city}
        location={location}
        setCity={setCity}
        setLocation={setLocation}
        onGetCurrentLocation={handleCurrentLocation}
      />

      <div className="flex flex-col space-y-4 p-6 mb-2">
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
            <option value="1">1 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="13">13 km</option>
            <option value="20">20 km</option>
            <option value="30">30 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
          </select>
        </div>

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

      <div className="space-y-4 mb-4">
        {!location.lat || !location.lon
          ? ""
          : filteredStations.map((station: Station, index: number) => (
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

      <footer className="w-full bg-gray-100 border-t border-gray-300 py-4 mt-[auto] mb-[0px]">
        <div className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} CheapIrishFuel. All rights reserved.{" "}
          <a className="text-blue-600" href="https://github.com/jhonnyfc">
            jhonnyfc
          </a>
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">
          Developed with ❤️ to help you save on fuel costs across Ireland.
        </div>
      </footer>
    </div>
  );
}
