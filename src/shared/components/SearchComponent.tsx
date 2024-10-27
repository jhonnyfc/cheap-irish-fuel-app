import React, { useState, useEffect } from "react";

interface Location {
  lat: number | null;
  lon: number | null;
}

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
  const [debouncedCity, setDebouncedCity] = useState(city);
  const [error, setError] = useState(false);

  // Debounce effect: Update `debouncedCity` only after a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCity(city);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler); // Clear timeout if input changes before delay is over
    };
  }, [city]);

  // Fetch Irish city suggestions only when `debouncedCity` changes
  useEffect(() => {
    const fetchCitySuggestions = async () => {
      if (!debouncedCity.trim()) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?countrycodes=ie&q=${encodeURIComponent(
            debouncedCity
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();

        if (data.length === 0) {
          setError(true); // Set error if no results are found
        } else {
          setSuggestions(data);
          setError(false); // Reset error if results are found
        }
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
        setError(true); // Set error on fetch failure
      }
    };

    fetchCitySuggestions();
  }, [debouncedCity]);

  // Handle user typing in the city input
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCity(newValue); // Update city input state
    setError(false); // Reset error on new input

    // Clear suggestions if input is empty
    if (!newValue.trim()) {
      handleDeleteLocation();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectSuggestion = (suggestion: any) => {
    const { lat, lon } = suggestion;
    setLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
    setCity(suggestion.display_name); // Set input to selected city name
    setSuggestions([]); // Clear suggestions after selection
    setError(false); // Reset error after successful selection
  };

  // Handle delete location
  const handleDeleteLocation = () => {
    setCity("");
    setLocation({ lat: null, lon: null });
    setSuggestions([]);
    setError(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <h2 className="text-xl font-semibold">Find Irish City Location</h2>

      {/* Irish City Search Input */}
      <div className="relative w-full max-w-sm">
        <input
          type="text"
          placeholder="Enter Irish city name"
          className={`w-full p-2 pr-10 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
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
            className="absolute inset-y-0 right-0 flex items-center p-2 mr-2 text-gray-400 bg-white rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            ✕
          </button>
        )}

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

      {/* Get Current Location Button */}
      <button
        onClick={onGetCurrentLocation}
        className="w-full max-w-sm px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Use Current Location
      </button>

      {/* Display Location Results */}
      {location.lat && location.lon && (
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Latitude: <span className="font-semibold">{location.lat}</span>
          </p>
          <p className="text-gray-700">
            Longitude: <span className="font-semibold">{location.lon}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
