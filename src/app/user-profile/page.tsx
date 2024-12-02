'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!userProfile) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 h-[90dvh] flex flex-col">
      <div className="bg-white rounded-xl shadow flex flex-col flex-1 overflow-hidden">
        {/* Header Section - Fixed */}
        <div className="p-4 sm:p-6 border-b border-gray-200 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <img
                src={userProfile.picture}
                alt={userProfile.name}
                className="w-16 h-16 rounded-full border-2 border-gray-200"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold text-gray-900 truncate">
                  {userProfile.name}
                </h1>
                <p className="text-gray-500 truncate">{userProfile.email}</p>
              </div>
            </div>
            <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1">
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                ${userProfile.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'}
              `}>
                {userProfile.status}
              </span>
              <span className="text-sm text-gray-500">
                {userProfile.role.name}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Account Info */}
              <Section title="Thông tin tài khoản">
                <InfoItem 
                  label="Credit" 
                  value={`${userProfile.credit.toLocaleString()} coins`}
                  icon={<CreditIcon />}
                  important
                />
                <InfoItem 
                  label="Mã giới thiệu" 
                  value={userProfile.affiliate_code}
                  copyable
                  icon={<CodeIcon />}
                  important
                />
                <InfoItem 
                  label="Tỷ lệ hoa hồng" 
                  value={`${(userProfile.commission * 100).toFixed(1)}%`}
                  icon={<CommissionIcon />}
                />
              </Section>

              {/* Activity Info */}
              <Section title="Hoạt động">
                <InfoItem 
                  label="Ngày tạo" 
                  value={formatDate(userProfile.created_at)}
                  icon={<CalendarIcon />}
                />
                <InfoItem 
                  label="Đăng nhập lần cuối" 
                  value={formatDate(userProfile.last_login_at)}
                  icon={<LoginIcon />}
                />
                <InfoItem 
                  label="IP đăng nhập" 
                  value={userProfile.last_login_ip}
                  icon={<IpIcon />}
                />
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  copyable?: boolean;
  important?: boolean;
}

function InfoItem({ label, value, icon, copyable, important }: InfoItemProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Đã sao chép!');
  };

  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className={`mt-1 ${important ? 'text-blue-500' : 'text-gray-400'}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`truncate ${important ? 'text-lg font-medium text-gray-900' : 'text-gray-700'}`}>
            {value}
          </span>
          {copyable && (
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors shrink-0"
              title="Sao chép"
            >
              <CopyIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Icons Components
function CopyIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CreditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );
}

function IpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

function CommissionIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}