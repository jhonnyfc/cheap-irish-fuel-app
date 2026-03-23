"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Station } from "@/shared/models/Station";
import { updateStationPrices } from "@/shared/services/stationService";
import {
  recordGasStationUpdate,
  getUserById,
} from "@/shared/services/userService";
import { auth } from "@/shared/services/authService";
import { useNotification } from "@/shared/context/NotificationContext";
import { onAuthStateChanged } from "firebase/auth";

interface EditFuelFormProps {
  station: Station;
}

export default function EditFuelForm({ station }: EditFuelFormProps) {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [unleadedPrice, setUnleadedPrice] = useState<string>(
    station.unleadedPrice?.toString() || "",
  );
  const [dieselPrice, setDieselPrice] = useState<string>(
    station.dieselPrice?.toString() || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        showNotification("You need to log in to edit prices", "error", 3000);
        router.push(`/station/${station.gasId}`);
      }
    });
    return () => unsubscribe();
  }, [router, showNotification, station.gasId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid) return;

    setIsSubmitting(true);

    // Check rate limit
    const { userProfile, error: userError } = await getUserById(userUid);
    if (!userProfile) {
      console.error(userError);
      showNotification("Failed to verify user status.", "error", 3000);
      setIsSubmitting(false);
      return;
    }

    const lastUpdate = userProfile.lastGasStationUpdate;
    if (lastUpdate && lastUpdate.stationId === station.gasId) {
      const lastUpdateTime = new Date(lastUpdate.date).getTime();
      const now = new Date().getTime();
      const diffMinutes = (now - lastUpdateTime) / (1000 * 60);

      if (diffMinutes < 5) {
        showNotification(
          "You can only update prices for the same station every 5 minutes.",
          "error",
          5000,
        );
        setIsSubmitting(false);
        return;
      }
    }

    const priceRegex = /^\d+([.,]\d{1,3})?$/;

    if (unleadedPrice && !priceRegex.test(unleadedPrice)) {
      showNotification(
        "Unleaded price must be a valid number with up to 3 decimal places",
        "error",
        3000,
      );
      setIsSubmitting(false);
      return;
    }

    if (dieselPrice && !priceRegex.test(dieselPrice)) {
      showNotification(
        "Diesel price must be a valid number with up to 3 decimal places",
        "error",
        3000,
      );
      setIsSubmitting(false);
      return;
    }

    const uPrice = unleadedPrice
      ? parseFloat(unleadedPrice.replace(",", "."))
      : null;
    const dPrice = dieselPrice
      ? parseFloat(dieselPrice.replace(",", "."))
      : null;

    if (uPrice !== null && (isNaN(uPrice) || uPrice <= 0)) {
      showNotification(
        "Invalid unleaded price: must be greater than 0",
        "error",
        3000,
      );
      setIsSubmitting(false);
      return;
    }

    if (dPrice !== null && (isNaN(dPrice) || dPrice <= 0)) {
      showNotification(
        "Invalid diesel price: must be greater than 0",
        "error",
        3000,
      );
      setIsSubmitting(false);
      return;
    }

    const { success } = await updateStationPrices(
      station.gasId,
      uPrice,
      dPrice,
      userUid
    );

    if (success) {
      await recordGasStationUpdate(userUid, station.gasId);
      showNotification("Prices updated successfully!", "success", 3000);
      router.push(`/station/${station.gasId}`);
    } else {
      showNotification(`Failed to update prices`, "error", 3000);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Edit Fuel Prices
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Unleaded Price (€ / L)
          </label>
          <input
            type="text"
            step="0.001"
            value={unleadedPrice}
            onChange={(e) => setUnleadedPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. 1.65"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Diesel Price (€ / L)
          </label>
          <input
            type="text"
            step="0.001"
            value={dieselPrice}
            onChange={(e) => setDieselPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. 1.55"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/station/${station.gasId}`)}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex justify-center items-center"
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Save Prices"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
