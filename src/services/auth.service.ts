import axiosInstance from '@/services/axiosInstance';

interface GoogleLoginRequest {
  token: string;
}

interface GoogleLoginResponse {
  success: boolean;
  data?: {
    email: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    email_verified: boolean;
    ref: string;
    accessToken?: string;
  };
  message?: string;
}

export const loginWithGoogle = async (
  params: GoogleLoginRequest
): Promise<GoogleLoginResponse> => {
  try {
    const { data } = await axiosInstance.post<GoogleLoginResponse>(
      '/api/login',
      params
    );

    // Lưu access token nếu có
    if (data.success && data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Đăng nhập thất bại');
  }
}; 