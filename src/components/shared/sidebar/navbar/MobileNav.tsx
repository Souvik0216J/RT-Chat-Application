'use client'
import React from 'react'
import { useNavigation } from '../../../../../hooks/useNavigation'
import { Card } from '@/components/ui/card'
import { UserButton } from '@clerk/clerk-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useChat } from '../../../../../hooks/useChat'
import { ThemeToggle } from '@/components/ui/theme/theme-toggle'

function MobileNav() {
    const paths = useNavigation()
    const { isActive } = useChat()

    if (isActive) return null

    return (
        <div>
            <Card className='fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden'>
                <nav className='w-full'>
                    <ul className='flex justify-evenly items-center'>
                        {paths.map((path, id) => (
                            <li key={id} className='relative'>
                                <Link href={path.href}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button className='hover:cursor-pointer' size="icon" variant={path.active ? "default" : "outline"}>
                                                {path.icon}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{path.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </Link>
                            </li>
                        ))}
                        <li><ThemeToggle /></li>
                        <li>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: {
                                            width: '34px',
                                            height: '34px',
                                        },
                                    },
                                }} />
                        </li>
                    </ul>
                </nav>
            </Card>
        </div>
    )
}

export default MobileNav
