import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import GroupsContext from '@/components/GroupsContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Разрабы дауны',
  description: 'Электронный дневник БГУИР',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <GroupsContext>
          {children}
        </GroupsContext>
        <SpeedInsights/>
      </body>
    </html>
  )
}