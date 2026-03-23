import { doc, setDoc, getDoc, getFirestore, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { app } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  createdAt: string;
  favorites?: string[];
  lastGasStationUpdate?: {
    date: string;
    stationId: string;
  };
}

const db = getFirestore(app);

export const createUser = async (
  uid: string,
  email: string,
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    // Only create if user doesn't already exist (useful for Google login)
    if (!userSnap.exists()) {
      const newUser: UserProfile = {
        uid,
        email,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, newUser);
    }
    return { success: true, error: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: String(error) };
  }
};

export const getUserById = async (
  uid: string,
): Promise<{ userProfile: UserProfile | null; error: string | null }> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { userProfile: userSnap.data() as UserProfile, error: null };
    } else {
      return { userProfile: null, error: "User not found" };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { userProfile: null, error: error.message };
    }
    return { userProfile: null, error: String(error) };
  }
};

export const toggleFavorite = async (
  uid: string,
  gasId: string,
  isAdding: boolean,
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      favorites: isAdding ? arrayUnion(gasId) : arrayRemove(gasId),
    });
    return { success: true, error: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: String(error) };
  }
};

export const recordGasStationUpdate = async (
  uid: string,
  gasId: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      lastGasStationUpdate: {
        date: new Date().toISOString(),
        stationId: gasId,
      },
    });
    return { success: true, error: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: String(error) };
  }
};
