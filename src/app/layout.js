import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import GroupContext from '@/components/GroupContext';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'Разрабы дауны',
  description: 'Электронный дневник БГУИР',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <GroupContext>
          {children}
        </GroupContext>
        <SpeedInsights/>
      </body>
    </html>
  )
}