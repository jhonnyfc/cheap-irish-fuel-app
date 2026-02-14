"use client";

import { useState } from "react";
import Image from "next/image";

interface AdvertisingBannerProps {
  logoSrc: string;
  title: string;
  description: string;
  link: string;
}

export default function AdvertisingBanner({
  logoSrc,
  title,
  description,
  link,
}: AdvertisingBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-96 max-w-[90%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-3 mt-4 flex items-center gap-3 relative animate-in fade-in slide-in-from-top-2 duration-300">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsVisible(false);
        }}
        className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-1 text-gray-500 dark:text-gray-300 transition-colors shadow-sm"
        aria-label="Close add"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 w-full group"
      >
        <div className="relative h-12 w-12 flex-shrink-0 bg-blue-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600">
          <Image
            src={logoSrc}
            alt={`${title} logo`}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {description}
          </p>
        </div>

        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </a>
    </div>
  );
}
