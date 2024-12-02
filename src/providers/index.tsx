'use client';
import GoogleOAuthProviderWrapper from "./GoogleOAuthProvider";
import { ReactNode } from "react";
import { ReduxProvider } from "./ReduxProvider";

function Providers({ children }: { children: ReactNode }) {
    return (
        <ReduxProvider>
            <GoogleOAuthProviderWrapper>
                {children}
            </GoogleOAuthProviderWrapper>
        </ReduxProvider>
    )
}

export default Providers;
