'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/shared/services/authService';
import { getUserById } from '@/shared/services/userService';
import { getStationsData } from '@/shared/services/stationService';
import { Station } from '@/shared/models/Station';
import FuelStationCard from '@/shared/components/cardFuelInfo';

export default function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [favStations, setFavStations] = useState<Station[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { userProfile, error: userError } = await getUserById(user.uid);
        if (userError || !userProfile) {
          setError(userError || 'User profile not found.');
          setLoading(false);
          return;
        }

        const userFavorites = userProfile.favorites || [];
        if (userFavorites.length === 0) {
          setFavStations([]);
          setLoading(false);
          return;
        }

        const data = await getStationsData();
        if (!data || !data.stations) {
          setError('Failed to fetch stations data.');
          setLoading(false);
          return;
        }

        const filteredStations = data.stations.filter(st => userFavorites.includes(st.gasId));
        setFavStations(filteredStations);
      } catch (err) {
        setError('An error occurred while fetching favorites.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-xl font-semibold text-gray-600">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-20">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full w-full">
      <h1 className="text-3xl font-bold mt-8 mb-6">Your Favorite Stations</h1>

      {favStations.length === 0 ? (
        <div className="mt-10 p-8 border border-gray-200 bg-gray-50 rounded-lg shadow-sm text-center">
          <p className="text-lg text-gray-600 font-medium">No gas favorites yet.</p>
          <p className="text-sm text-gray-400 mt-2">Go back and save some stations to see them here!</p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-6 p-4 w-full max-w-7xl">
          {favStations.map((station, index) => (
            <FuelStationCard
              key={index}
              gasId={station.gasId}
              name={station.stationName}
              city={station.countyName ?? '---'}
              distance={station.distance ?? '---'}
              mapsLink={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}
              fuelPrices={[
                {
                  type: 'Diesel',
                  price: station.dieselPrice ?? '---',
                },
                {
                  type: 'Unleaded',
                  price: station.unleadedPrice ?? '---',
                },
              ]}
              dateUpdated={station.dateUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
