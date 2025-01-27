import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import GroupContext from '@/components/GroupContext';
import ReduxProvider from '@/components/ReduxProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'Расписание БГУИР',
  description: 'Расписание пар в БГУИР с возможностью добавлять домашние задания и заметки',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ReduxProvider>
          <GroupContext>
            {children}
          </GroupContext>
        </ReduxProvider>
        <SpeedInsights/>
      </body>
    </html>
  )
}