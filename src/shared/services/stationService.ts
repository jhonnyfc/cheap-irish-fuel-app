import { app } from "./firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { Station } from "../models/Station";

const db = getFirestore(app);

export interface StationsData {
  updateDate: string;
  stations: Station[];
}

const COLLECTION_NAME = "all-fuel-stations";
const DOCUMENT_ID = "latest";

export const getStationsData = async (): Promise<StationsData | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as StationsData;
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching station data:", error);
    return null;
  }
};
