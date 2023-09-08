import { getAuthSession } from '@/lib/nextauth'
import React, { useState } from 'react'
import Link from 'next/link'
import SignInButton from './SignInButton'
import { ImSearch } from 'react-icons/im'
import { BsCardList } from 'react-icons/bs'
import { SiSololearn } from 'react-icons/si'
import { Session } from 'inspector'
import UserAccountNav from './UserAccountNav'

type Props = {}

const Navbar = async (props: Props) => {
    
    const session = await getAuthSession()

   

    return (
        <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 h-fit border-b border-zinc-300 py-2">
            <div className="flex justify-between items-center h-full gap-2 px-8 mx-auto ">
                <Link href="/" className="flex items-center gap-2">
                    <p className="rounded-lg border-2 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-1 md:block dark:border-white">
                        Vocab Ninja
                    </p>
                </Link>
                {session?.user ? (
                    <UserAccountNav user={session.user} />
                ) : (
                    <SignInButton text={'Sign in'} />
                )}
            </div>
        </div>
    )
}

export default Navbar
