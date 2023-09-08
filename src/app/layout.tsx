import { cn } from '@/lib/utils'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Vocab Ninja',
    description:
        'Be a Standardized Testing Pro. Learn Vocab with active recall to ace the SAT, ACT, GRE, GMAT, and more.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={cn(inter.className, ' antialiased')}>
                <Providers>
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
