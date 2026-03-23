import { app } from "./firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { Station } from "../models/Station";

const db = getFirestore(app);

export interface StationsData {
  updateDate: string;
  stationsMap: Record<string, Station>;
}

export interface LegacyStationsData {
  updateDate: string;
  stations: Station[];
}

const COLLECTION_NAME = "all-fuel-stations";
const DOCUMENT_ID = "stationsMap";

export const getStationsData = async (): Promise<LegacyStationsData | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as StationsData;
      // Convert the map back to an array so the rest of the application components
      // (like FuelStationsList, Station detail page) do not need to be refactored.
      const stationsArray = data.stationsMap
        ? Object.values(data.stationsMap)
        : [];
      return {
        updateDate: data.updateDate,
        stations: stationsArray,
      };
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching station data:", error);
    return null;
  }
};

import { updateDoc } from "firebase/firestore";

export const updateStationPrices = async (
  gasId: string,
  unleadedPrice: number | null,
  dieselPrice: number | null,
  updatedBy: string,
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);

    // Create an object to hold only the specific fields we are updating
    const updates: Record<string, unknown> = {
      [`stationsMap.${gasId}.dateUpdated`]: new Date().toISOString(),
      [`stationsMap.${gasId}.updatedBy`]: updatedBy,
    };

    if (unleadedPrice !== null) {
      updates[`stationsMap.${gasId}.unleadedPrice`] = unleadedPrice;
    }
    if (dieselPrice !== null) {
      updates[`stationsMap.${gasId}.dieselPrice`] = dieselPrice;
    }

    // Direct O(1) update to the document fields without rewriting the entire map
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(docRef, updates as any);

    return { success: true, error: null };
  } catch (error: unknown) {
    console.error("Error updating station prices:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: String(error) };
  }
};
