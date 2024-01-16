import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers';
// app/fonts.ts
import { Space_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar';
import Web3ModalProvider from "../context/Web3Modal";
import StoreProvider from './StoreProvider';

const mono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'COQ In The Road',
  description: 'What happened when the COQ crossed the road?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={mono.className}>
      <body>
        <StoreProvider>
          <ThemeProvider>
            <Web3ModalProvider>
              <Navbar />
              {children}
            </Web3ModalProvider>
          </ThemeProvider>
        </StoreProvider>
        </body>
    </html>
  )
}
