import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'
import AppShell from '@/components/AppShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Algobounty | Trustless Bounty Escrow',
  description: 'Eliminate trust issues in open bounty platforms with automated escrow agents. Secure, transparent, and fully on-chain.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0f] text-white min-h-screen flex flex-col`}>
        <WalletProvider>
          <AppShell>
            {children}
          </AppShell>
        </WalletProvider>
      </body>
    </html>
  )
}
