'use client';
import GoogleOAuthProviderWrapper from "./GoogleOAuthProvider";
import { ReactNode } from "react";
import { ReduxProvider } from "./ReduxProvider";
import { AuthProvider } from "./AuthProvider";

function Providers({ children }: { children: ReactNode }) {
    return (
        <ReduxProvider>
            <AuthProvider>
                <GoogleOAuthProviderWrapper>
                    {children}
                </GoogleOAuthProviderWrapper>
            </AuthProvider>
        </ReduxProvider>
    )
}

export default Providers;
