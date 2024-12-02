
'use client';

import GoogleLogin_Button from "@/components/GoogleLogin_Button";
import UserProfileButton from "@/components/UserProfileButton";
import { useAuth } from "@/providers/AuthProvider";

function LoginButton() {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? <GoogleLogin_Button /> : <UserProfileButton />
}

export default LoginButton;