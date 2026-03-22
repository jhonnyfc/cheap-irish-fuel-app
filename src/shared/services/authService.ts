import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { app } from "./firebase";
import { createUser } from "./userService";

export const auth = getAuth(app);

export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    if (userCredential.user.email) {
      await createUser(userCredential.user.uid, userCredential.user.email);
    }
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, googleProvider);
    if (userCredential.user.email) {
      await createUser(userCredential.user.uid, userCredential.user.email);
    }
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
