import { ReactNode } from "react";
import GoogleOAuthProviderWrapper from "./GoogleOAuthProvider";



function Providers({ children }: { children: ReactNode }) {
    return (
        <GoogleOAuthProviderWrapper>
            {children}
        </GoogleOAuthProviderWrapper>
    )
}

export default Providers;