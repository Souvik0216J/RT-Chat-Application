"use client"
import ChatFallback from '@/components/shared/conversation/ChatFallback'
import ItemList from '@/components/shared/item-list/ItemList'
import React from 'react'
import AddFriendDialog from './_components/AddFriendDialog'

type Props = {}

const FriendsPage = (props: Props) => {
    return (
        <>
            <ItemList title='Friends' action={<AddFriendDialog />}></ItemList>
            <ChatFallback />
        </>
    )
}

export default FriendsPage