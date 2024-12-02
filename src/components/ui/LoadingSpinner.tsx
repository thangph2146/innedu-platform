'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullscreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3'
};

export function LoadingSpinner({ size = 'md', fullscreen = false }: LoadingSpinnerProps) {
  const spinnerClass = `${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`;
  
  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
        <div className="bg-white/80 rounded-lg p-6 shadow-lg flex flex-col items-center gap-3">
          <div className={spinnerClass} />
          <p className="text-sm text-gray-600 animate-pulse">Đang xử lý...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-md z-10">
      <div className={spinnerClass} />
    </div>
  );
} 