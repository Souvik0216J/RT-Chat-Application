"use client"
import ChatFallback from '@/components/shared/conversation/ChatFallback'
import ItemList from '@/components/shared/item-list/ItemList'
import React from 'react'
import AddFriendDialog from './_components/AddFriendDialog'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Loader2 } from 'lucide-react'
import Request from './_components/Request'

type Props = {}

const FriendsPage = (props: Props) => {
    const requests = useQuery(api.requests.get)

    return (
        <>
            <ItemList title='Friends' action={<AddFriendDialog />}>
                {
                    requests ? requests.length === 0 ? <p className='w-full h-full flex items-center justify-center'>No friends requests found</p> : requests.map(request => { return <Request key={request.requests._id} id={request.requests._id} imageUrl={request.sender.imageUrl} username={request.sender.username} email={request.sender.email} _creationTime={request.requests._creationTime}></Request> }) : <Loader2 className='h-8 w-8 animate-spin' />
                }
            </ItemList>
            <ChatFallback />
        </>
    )
}

export default FriendsPage