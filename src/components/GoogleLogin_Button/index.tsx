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
          flex items-center gap-2 px-4 py-2 
          border border-gray-300 rounded-md
          hover:bg-gray-50 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          font-medium text-gray-700 bg-white hover:bg-gray-600 hover:text-white
        `}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
      </button>
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
