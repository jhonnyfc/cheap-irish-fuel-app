'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/shared/services/authService';

export default function AuthListener() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Set a session cookie that the middleware can read
        // The token is used to mark an active session
        const token = await user.getIdToken();
        document.cookie = `session_token=${token}; path=/; max-age=3600; Secure; SameSite=Lax`;
      } else {
        // Clear the cookie when logged out
        document.cookie = `session_token=; path=/; max-age=0; Secure; SameSite=Lax`;
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
