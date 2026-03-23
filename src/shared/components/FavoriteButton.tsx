'use client';

import React from 'react';
import { useFavoriteToggle } from '@/shared/hooks/useFavoriteToggle';
import { useNotification } from '@/shared/context/NotificationContext';

interface FavoriteButtonProps {
  gasId: string;
}

export default function FavoriteButton({ gasId }: FavoriteButtonProps) {
  const { isFavorite, handleToggle, isLoaded } = useFavoriteToggle(gasId);
  const { showNotification } = useNotification();

  if (!isLoaded) {
    return <div className="w-10 h-10"></div>; // Placeholder
  }

  const onClick = (e: React.MouseEvent) => {
    const success = handleToggle(e);
    if (success === false) {
      showNotification('You need to log in to save your favorite stations.', 'info', 5000);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={onClick}
        className={`p-2 rounded-full transition-colors duration-200 z-10 ${
          isFavorite 
            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30' 
            : 'text-gray-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
        }`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
    </div>
  );
}
