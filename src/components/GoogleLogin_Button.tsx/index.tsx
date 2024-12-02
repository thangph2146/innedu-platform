'use client'

import { loginWithGoogle } from '@/services/auth.service';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

function GoogleLogin_Button() {
    const router = useRouter();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await loginWithGoogle({
                    token: tokenResponse.access_token,
                });

                if (response.success && response.data) {
                    console.log('Đăng nhập thành công:', response.data);
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
            }
        },
        onError: () => {
            console.error('Đăng nhập thất bại');
        }
    });

    return (
        <button
            onClick={() => login()}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 hover:text-gray-900"
        >
            <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-6 h-6"
            />
            Đăng nhập với Google
        </button>
    );
}

export default GoogleLogin_Button;
