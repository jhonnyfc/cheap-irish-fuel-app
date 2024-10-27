"use client";

import { useState } from "react";
import FuelStationCard from "@/shared/components/cardFuelInfo";
import SearchComponent from "@/shared/components/SearchComponent";

interface Location {
  lat: number | null;
  lon: number | null;
}

export default function Home() {
  const station = {
    name: "Fast Fuel Station",
    city: "San Francisco",
    distance: 2.5,
    mapsLink: "https://maps.google.com",
    fuelPrices: [
      { type: "Diesel", price: 1.2 },
      { type: "Petrol", price: 1.3 },
    ],
  };

  const [city, setCity] = useState<string>("");
  const [location, setLocation] = useState<Location>({ lat: null, lon: null });

  const setCityNameFromLatLong = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      // Reverse Geocoding: Get city name based on coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();

      const city =
        data.address.city || data.address.town || data.address.village;
      setCity(city || "Unknown Location"); // Set city or a fallback if not found
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
          console.log("Current Location:", { latitude, longitude });
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

  return (
    <div className="flex flex-col items-center">
      <SearchComponent
        city={city}
        location={location}
        setCity={setCity}
        setLocation={setLocation}
        onGetCurrentLocation={handleCurrentLocation}
      />
      <FuelStationCard
        name={station.name}
        city={station.city}
        distance={station.distance}
        mapsLink={station.mapsLink}
        fuelPrices={station.fuelPrices}
      />
    </div>
  );
}
