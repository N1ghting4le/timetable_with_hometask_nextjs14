import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Разрабы дауны',
  description: 'Электронный дневник группы 318103',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{overflowY: 'hidden'}}>{children}</body>
    </html>
  )
}
