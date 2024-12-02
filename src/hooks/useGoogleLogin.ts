import { API_ENDPOINT } from "@/constants/api_endpoints";
import { LOCAL_STORAGE_KEYS } from "@/constants/local_storage";
import axiosInstance from "@/services/axiosInstance";
import { useState, useCallback } from "react";
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

  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
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
  }, [router]);

  const handleGoogleLogin = async () => {
    if (typeof window === 'undefined' || !window.google) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        use_fedcm_for_prompt: true
      });

      // Render button thay vì dùng prompt
      const buttonDiv = document.createElement('div');
      buttonDiv.style.display = 'none';
      document.body.appendChild(buttonDiv);

      window.google.accounts.id.renderButton(
        buttonDiv,
        { theme: 'outline', size: 'large' }
      );

      // Trigger click vào button
      const button = buttonDiv.querySelector('div[role="button"]');
      if (button instanceof HTMLElement) {
        button.click();
      }

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(buttonDiv);
      }, 1000);

    } catch (error) {
      console.error('Lỗi khởi tạo Google Sign-In:', error);
      setError('Không thể khởi tạo đăng nhập Google. Vui lòng thử lại sau.');
    }
  };

  return { handleGoogleLogin, isLoading, error };
}; 