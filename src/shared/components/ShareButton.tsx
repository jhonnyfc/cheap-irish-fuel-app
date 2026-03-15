"use client";

import React, { useState } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200 relative flex-shrink-0"
      aria-label="Share station"
      title="Share station"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        ></path>
      </svg>
      {copied && (
        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap font-medium">
          Link Copied!
        </span>
      )}
    </button>
  );
};

export default ShareButton;
