import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wosia Wangu — Tanzania',
  description: 'Andika wosia wako wa kisheria kwa Kiswahili',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw">
      <body>{children}</body>
    </html>
  )
}
