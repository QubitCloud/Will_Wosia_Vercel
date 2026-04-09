import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wosia Wangu — Tanzania',
  description: 'Andika wosia wako wa kisheria kwa Kiswahili',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw">
      <body>{children}</body>
    </html>
  )
}
