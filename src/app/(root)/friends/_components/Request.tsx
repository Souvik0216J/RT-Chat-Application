import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Check, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    id: Id<"requests">;
    imageUrl?: string;
    username: string;
    email: string;
    _creationTime: number;
}

const Request = ({ id, imageUrl, username, email, _creationTime }: Props) => {

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        // Show relative time for recent requests
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        // For older requests, show actual date
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <Card className='w-full p-2 flex flex-row items-center justify-between gap-2'>
            <div className='flex items-center gap-4 truncate'>
                <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={imageUrl} className="h-10 w-10 object-cover rounded-4xl" />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>

                <div className='flex flex-col truncate'>
                    <h4 className="truncate">{username}</h4>
                    <p className="text-xs text-muted-foreground truncate">{email}</p>
                    {_creationTime && (
                        <p className="text-xs text-muted-foreground truncate">
                            {formatDate(_creationTime)}
                        </p>
                    )}
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <Button size="icon" onClick={() => { }}>
                    <Check />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => { }}>
                    {/* <Cross/> */}
                    <X className='h-4 w-4' />
                </Button>
            </div>
        </Card>
    )
}

export default Request