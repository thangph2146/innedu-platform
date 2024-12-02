import { API_ENDPOINT } from "@/constants/api_endpoints";
import { LOCAL_STORAGE_KEYS } from "@/constants/local_storage";
import axiosInstance from "@/services/axiosInstance";
import { useState } from "react";
import { useRouter } from 'next/navigation';

interface GoogleCredentialResponse {
  credential: string;
}

interface LoginResponse {
  status: string;
  data: {
    token: string;
  };
}

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    if (typeof window === 'undefined' || !window.google) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: GoogleCredentialResponse) => {
        if (response.credential) {
          try {
            setIsLoading(true);
            setError(null);
            
            const result = await axiosInstance.post<LoginResponse>(
              API_ENDPOINT.LOGIN_ENDPOINT,
              { token: response.credential },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            if (result.data.status === 'success') {
              localStorage.setItem(
                LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
                result.data.data.token
              );

              axiosInstance.defaults.headers.common['Authorization'] = 
                `Bearer ${result.data.data.token}`;

              router.push('/');
            }
          } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            setError(
              err instanceof Error 
                ? err.message 
                : 'Đăng nhập thất bại, vui lòng thử lại'
            );
          } finally {
            setIsLoading(false);
          }
        }
      },
      use_fedcm_for_prompt: false
    });

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('Không thể hiển thị prompt, lý do:', notification.getNotDisplayedReason());
          window.google.accounts.id.prompt();
        }
        if (notification.isSkippedMoment()) {
          console.log('Người dùng bỏ qua đăng nhập:', notification.getSkippedReason());
        }
        if (notification.isDismissedMoment()) {
          console.log('Người dùng đóng popup:', notification.getDismissedReason());
        }
      });
    } catch (error) {
      console.error('Lỗi hiển thị prompt:', error);
      window.google.accounts.id.prompt();
    }
  };

  return { handleGoogleLogin, isLoading, error };
}; 