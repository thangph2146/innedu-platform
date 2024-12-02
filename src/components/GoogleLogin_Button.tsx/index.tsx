'use client'

import { useEffect } from 'react';
import { useGoogleLogin } from '@/hooks/useGoogleLogin';

const GoogleLogin_Button = () => {
  const { handleGoogleLogin, isLoading, error } = useGoogleLogin();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={`
          relative flex items-center gap-2 px-4 py-2 w-full max-w-[240px]
          border rounded-md transition-all duration-200 hover:text-gray-800
          ${isLoading 
            ? 'bg-gray-100 cursor-not-allowed opacity-70 text-gray-500' 
            : 'hover:bg-gray-100 active:scale-95'
          }
        `}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-md">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 48 48"
          className={isLoading ? 'opacity-0' : ''}
        >
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
        <span className={`min-w-[120px] ${isLoading ? 'opacity-0' : ''}`}>
          Đăng nhập với Google
        </span>
      </button>
      
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12" y2="16"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleLogin_Button;
