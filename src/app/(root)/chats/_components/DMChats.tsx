"use client"
import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';

type Props = {
    id: Id<"chats">;
    imageUrl: string;
    username: string;
}

const DMChats = ({ id, imageUrl, username }: Props) => {
    return <Link href={`/chats/${id}`} className='w-full'>
        <Card className='p-2 flex flex-row items-center gap-4 truncate'>
            <div className='flex flex-row items-center gap-4 truncate'>
                <Avatar>
                    <AvatarImage src={imageUrl} className="h-10 w-10 object-cover rounded-4xl"/>
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>

                <div className='flex flex-col truncate'>
                    <h4 className="truncate">{username}</h4>
                    <p className='text-sm text-muted-foreground'>Start the chats</p>
                </div>
            </div>
        </Card>
    </Link>
}

export default DMChats