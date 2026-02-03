import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mood Monster - 감정 일기',
  description: '당신의 감정이 몬스터로 태어나는 곳',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
