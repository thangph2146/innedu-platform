'use client'
import { ReactNode } from 'react';
import { GoogleOAuthProvider as GoogleAuthProvider } from '@react-oauth/google';


interface Props {
  children: ReactNode;
}

function GoogleOAuthProviderWrapper({ children }: Props) {
 

  return (
    <GoogleAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!} >
      {children}
    </GoogleAuthProvider>
  );
}

export default GoogleOAuthProviderWrapper;