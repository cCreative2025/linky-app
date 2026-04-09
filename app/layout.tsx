import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Linky',
  description: '나의 링크 모음',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
