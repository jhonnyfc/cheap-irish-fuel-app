'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/shared/services/authService';
import { useNotification } from '@/shared/context/NotificationContext';

interface EditButtonProps {
  gasId: string;
}

export default function EditButton({ gasId }: EditButtonProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return <div className="w-10 h-10"></div>; // Placeholder
  }

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      showNotification('You need to log in to update fuel prices.', 'info', 5000);
    } else {
      router.push(`/station/${gasId}/edit`);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={onClick}
        className="p-2 rounded-full transition-colors duration-200 z-10 text-gray-400 hover:text-blue-500 hover:bg-blue-50"
        aria-label="Edit gas station prices"
        title="Edit gas station prices"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </button>
    </div>
  );
}
