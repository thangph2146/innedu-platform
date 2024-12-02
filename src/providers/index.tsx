'use client';
import GoogleOAuthProviderWrapper from "./GoogleOAuthProvider";
import { ReactNode } from "react";
import { ReduxProvider } from "./ReduxProvider";
import { AuthProvider } from "./AuthProvider";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

function Providers({ children }: { children: ReactNode }) {
    return (
        <ReduxProvider>
            <AuthProvider>
                <GoogleOAuthProviderWrapper>
                    <AnimatePresence mode="wait">
                        {children}
                    </AnimatePresence>
                </GoogleOAuthProviderWrapper>
            </AuthProvider>
        </ReduxProvider>
    )
}

export default Providers;
