'use client'

import { useGoogleLogin } from "@/hooks/useGoogleLogin";

export default function GoogleLogin_Button() {
  const { handleGoogleLogin, isLoading, error } = useGoogleLogin();

  return (
    <div className="relative">
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={`
          relative flex items-center justify-center gap-2
          w-full sm:w-auto
          px-3 sm:px-4 py-2 sm:py-2.5
          bg-white border border-gray-200
          rounded-lg
          text-sm font-medium
          text-gray-700 hover:text-gray-900
          hover:bg-gray-50/80 active:bg-gray-100/80
          disabled:opacity-70 disabled:cursor-not-allowed
          shadow-sm hover:shadow
          transition-all duration-200
          group
        `}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-lg">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Google Icon */}
        <div className="w-5 h-5 transition-transform duration-200 group-hover:scale-105">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>

        {/* Button Text */}
        <span>
          {isLoading ? (
            <span className="animate-pulse">Đang xử lý...</span>
          ) : (
            <span className="hidden sm:inline">Đăng nhập với Google</span>
          )}
        </span>
      </button>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border border-red-100 rounded-lg shadow-sm">
          <div className="flex gap-2">
            <svg 
              className="w-4 h-4 text-red-500 shrink-0 mt-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-red-600">
                {error}
              </p>
              <button
                onClick={handleGoogleLogin}
                className="mt-1 text-xs font-medium text-red-700 hover:text-red-800 inline-flex items-center gap-0.5 group"
              >
                Thử lại
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
