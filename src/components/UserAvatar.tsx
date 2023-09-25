import { User } from 'next-auth'
import Image from "next/legacy/image"
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'

type Props = {
    user: Pick<User, 'name' | 'image'>
}

const UserAvatar = ({ user }: Props) => {
    return (
        <Avatar>
            {user.image ? (
                <div className="relative w-full h-full aspect-square">
                    <p className="text-lg font-semibold ">{user.name}</p>
                    <Image
                        layout="fill"
                        src={user.image}
                        alt="profile image"
                        referrerPolicy="no-referrer"
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only"> {user?.name}</span>
                </AvatarFallback>
            )}
        </Avatar>
    )
}

export default UserAvatar
