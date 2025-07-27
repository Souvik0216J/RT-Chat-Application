import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

const addFriendFormSchema = z.object({
    email: z.string().min(1, { message: "This field can't be empty" }).email("Please enter a valid email")
})

function AddFriendDialog() {
    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues: {
            email: ""
        }
    })

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="outline">
                            <UserPlus />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add Friend</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                    <DialogDescription>
                        Send a request to connect with your friends!
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddFriendDialog
