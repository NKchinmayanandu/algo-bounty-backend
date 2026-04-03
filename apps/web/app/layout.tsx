import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { WalletProvider } from '@/components/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trustless Task Bounty',
  description: 'A platform to complete tasks funded by Algorand smart contracts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen flex flex-col`}>
        <WalletProvider>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}
