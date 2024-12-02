'use client'
import { ReactNode, useEffect } from 'react';
import { GoogleOAuthProvider as GoogleAuthProvider } from '@react-oauth/google';


interface Props {
  children: ReactNode;
}

function GoogleOAuthProviderWrapper({ children }: Props) {
 
  useEffect(() => {
    // Load Google script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <GoogleAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!} >
      {children}
    </GoogleAuthProvider>
  );
}

export default GoogleOAuthProviderWrapper;