import LandingPage from '@/components/LandingPage'
import StudyPage from '@/components/StudyPage'
import Dictionary from '@/components/WordCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { prisma } from '@/lib/db'
import { getAuthSession } from '@/lib/nextauth'
import { cn } from '@/lib/utils'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import react, { useState } from 'react'
async function Home() {
    const session = await getAuthSession()
    if (session?.user) {
        return redirect('/study')
    }
    return (
        <div>
            <LandingPage />
        </div>
    )
}

export default Home
