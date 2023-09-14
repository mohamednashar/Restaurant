import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Prvider from "../Redux/Prvider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Restaurant App',
  description: 'Restaurant App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Prvider>
        <Notification/>
        <Navbar/>
        {children}
        <Footer/>
        </Prvider>
        
        </body>
      
    </html>
  )
}
