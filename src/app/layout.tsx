import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers';
// app/fonts.ts
import { Rubik } from 'next/font/google'
import Navbar from '@/components/Navbar';
import Web3ModalProvider from "../context/Web3Modal";
import StoreProvider from './StoreProvider';

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
})

export const fonts = {
  rubik,
}
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
    <html lang="en" className={fonts.rubik.variable}>
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
