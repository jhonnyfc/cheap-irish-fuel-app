"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/shared/services/firebase";
import { logoutUser } from "@/shared/services/authService";

const auth = getAuth(app);

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <nav className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-lg">
              <span className="text-green-600 dark:text-green-500">Cheap </span>
              <span className="text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.9)] dark:drop-shadow-none">
                Irish{" "}
              </span>
              <span className="text-orange-500 dark:text-orange-400">Fuel</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/favorites"
                  className="text-sm font-bold text-red-500 dark:text-red-500 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Favorites
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
