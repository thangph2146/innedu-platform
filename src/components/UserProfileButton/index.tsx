'use client';

import { useAuth } from "@/providers/AuthProvider";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function UserProfileButton() {
  const { isAuthenticated, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!isAuthenticated || !userProfile) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2.5 rounded-full bg-white hover:bg-gray-100/80 active:bg-gray-200/80 transition-all"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <img
            src={userProfile.picture}
            alt={userProfile.name}
            className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-700 line-clamp-1">
            {userProfile.name}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            {userProfile.credit.toLocaleString()} coins
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`
          absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50
          transition-all duration-200 origin-top-right
          ${isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-[-10px] pointer-events-none'
          }
        `}
      >
        {/* User Info */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900 line-clamp-1">
            {userProfile.name}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1">
            {userProfile.email}
          </p>
        </div>

        {/* Menu Items */}
        <div className="py-1.5">
          <Link
            href="/user-profile"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            Thông tin cá nhân
          </Link>

          <div className="px-4 py-2.5 text-sm">
            <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg">
              <span className="text-gray-600">Robi:</span>
              <span className="font-medium text-gray-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                {userProfile.credit.toLocaleString()} robi
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group"
          >
            <svg 
              className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
} 