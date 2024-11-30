import React, { useState, useRef } from "react";
import { Location } from "@/shared/models/Location";

interface SearchComponentProps {
  city: string;
  location: Location;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  onGetCurrentLocation: () => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  city,
  location,
  setCity,
  setLocation,
  onGetCurrentLocation,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const suggestionsDebouncer = useRef<any>(null);

  const fetchCitySuggestions = async (cityTyped: string) => {
    if (!cityTyped.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?countrycodes=ie&q=${encodeURIComponent(
          cityTyped
        )}&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();

      if (data.length === 0) {
        setError(true);
      } else {
        setSuggestions(data);
        setError(false);
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setError(true);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setError(false);
    setCity(newValue); // Set input to selected city name
    if (!newValue.trim()) {
      return handleDeleteLocation();
    }

    if (suggestionsDebouncer.current) {
      clearTimeout(suggestionsDebouncer.current);
    }

    suggestionsDebouncer.current = setTimeout(() => {
      fetchCitySuggestions(newValue);
    }, 500);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectSuggestion = (suggestion: any) => {
    const { lat, lon } = suggestion;
    setLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
    setCity(suggestion.display_name);
    setSuggestions([]);
    setError(false);
  };

  const handleDeleteLocation = () => {
    setCity("");
    setLocation({ lat: null, lon: null });
    setSuggestions([]);
    setError(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <div className="relative w-full max-w-sm">
        <div className="flex items-center w-full max-w-sm space-x-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Enter Irish city name"
            className={`flex-grow p-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 text-black ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            value={city}
            onChange={handleCityChange}
          />

          {/* Delete Button - Appears only when location is set */}
          {location.lat && location.lon && (
            <button
              onClick={handleDeleteLocation}
              className="p-2 text-gray-400 bg-white rounded-full hover:text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Autocomplete suggestions dropdown */}
        {suggestions.length > 0 && !error && (
          <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="p-2 cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-500">
            No results found. Please check the city name.
          </p>
        )}
      </div>

      <button
        onClick={onGetCurrentLocation}
        className="w-full max-w-sm px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Use Current Location
      </button>
    </div>
  );
};

export default SearchComponent;
