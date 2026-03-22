import { useState, useCallback, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { auth } from '@/shared/services/authService';
import { app } from '@/shared/services/firebase';
import { toggleFavorite } from '@/shared/services/userService';

const db = getFirestore(app);

export function useFavoriteToggle(gasId: string) {
  const [userUid, setUserUid] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const serverStateRef = useRef(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
        setIsFavorite(false);
        setIsLoaded(true);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userUid) return;

    const userRef = doc(db, 'users', userUid);
    const unsubscribeSnap = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const favs = data.favorites || [];
        const isFav = favs.includes(gasId);
        
        // Only update local state if we aren't currently waiting for a debounced write to finish.
        // Otherwise, a snapshot might arrive mid-debounce and revert our optimistic UI.
        if (!timerRef.current) {
           setIsFavorite(isFav);
        }
        serverStateRef.current = isFav;
      }
      setIsLoaded(true);
    });

    return () => unsubscribeSnap();
  }, [userUid, gasId]);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (!userUid) {
        return false;
      }

      const nextState = !isFavorite;
      setIsFavorite(nextState); // optimistic update

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(async () => {
        const { error } = await toggleFavorite(userUid, gasId, nextState);
        if (error) {
          console.error("Failed to toggle favorite:", error);
          setIsFavorite(serverStateRef.current); // rollback
        } else {
          serverStateRef.current = nextState;
        }
        timerRef.current = null; // Clear the timer lock
      }, 600); // 600ms debounce

      return true;
    },
    [userUid, gasId, isFavorite]
  );

  return { isFavorite, handleToggle, userUid, isLoaded };
}
