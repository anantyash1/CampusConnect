import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import CursorGlow from '@/components/CursorGlow';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=Poppins&display=swap"
        rel="stylesheet"
      />
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: 'white',
            border: '1px solid #374151',
          },
        }}
      />
      <Component {...pageProps} />
      <CursorGlow /> 
    </SessionProvider>
  );
}