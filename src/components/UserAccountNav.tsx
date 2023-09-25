'use client'
import React from 'react'
import { User } from 'next-auth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from "next/legacy/image"
import { GoSignOut } from 'react-icons/go'
import { BiUser } from 'react-icons/bi'
import { LuSettings } from 'react-icons/lu'
import { signOut } from 'next-auth/react'
import UserAvatar from './UserAvatar'

type Props = {
    user: User
}

const UserAccountNav = (props: Props) => {
    function getFirstName(fullName: string | null | undefined): string {
        if (fullName) {
            const nameParts = fullName.split(' ')
            if (nameParts.length >= 2) {
                return `${nameParts[0]} ${nameParts[1].charAt(0)}.`
            }
            return nameParts[0] // Return just the first name if there's no last name
        }
        return ''
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-lg outline-none">
                <UserAvatar user={props.user} />
                <div>{getFirstName(props.user?.name)}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <div className="flex items-center gap-2 w-full text-lg ">
                        <div>
                            <BiUser />
                        </div>
                        <div>My Plan</div>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <div className="flex items-center gap-2 w-full  text-lg">
                        <div>
                            <LuSettings />
                        </div>
                        <div>Settings</div>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault()
                        signOut().catch(console.error)
                    }}
                    className=" text-lg text-red-600"
                >
                    <div className="flex items-center  gap-2 w-full  ">
                        <div>
                            <GoSignOut />
                        </div>
                        <div>Sign out</div>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountNav
