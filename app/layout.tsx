import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AetherStack-ai | Sovereign OS',
  description: 'Autonomous Infrastructure Governance',
  icons: { icon: '/icon-512.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-black text-white antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}