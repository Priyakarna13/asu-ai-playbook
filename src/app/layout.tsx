import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ASU AI Playbook',
  description: 'Practical ways to use AI — Students & Faculty',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
