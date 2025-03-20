'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { AuthContext } from '@/context/AuthContext';

export default function Header() {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            {user &&
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="text-blue-600 font-bold text-xl">AnalyzeIt</div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Image
                                    src={user.photoURL || "/default-avatar.jpg"}
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <span className="ml-2 text-gray-700">{user.displayName || user.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>
            }
        </>
    );
}