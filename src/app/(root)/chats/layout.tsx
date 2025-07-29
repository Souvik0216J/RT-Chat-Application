"use client"

import ItemList from '@/components/shared/item-list/ItemList'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { Loader2 } from 'lucide-react'
import DMChats from './_components/DMChats'

type Props = React.PropsWithChildren<{}>

const ChatLayout = ({ children }: Props) => {
    const chats = useQuery(api.chat.get)
    return (
        <>
            <ItemList title='Chats'>
                {chats ? chats.length === 0 ? <p className='w-full h-full flex items-center justify-center'>No chats found</p> : chats.map(chats => {
                    return chats.chat.isGroup ? null : (<DMChats key={chats.chat._id} id={chats.chat._id} username={chats.otherMember?.username || ""} imageUrl={chats.otherMember?.imageUrl || ""} />)
                }) : <Loader2 className='h-8 w-8 animate-spin'/>}
            </ItemList>
            {children}
        </>
    )
}

export default ChatLayout