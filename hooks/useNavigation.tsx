import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { MessageSquare, Users } from "lucide-react"

export const useNavigation = () => {
    const pathname = usePathname()

    const paths = useMemo(() => [
        {
            name: "Chats",
            href: "/chats",
            icon: <MessageSquare />,
            active: pathname.startsWith("/chats"),
        },
        {
            name: "Friends",
            href: "/friends",
            icon: <Users />,
            active: pathname.startsWith("/friends"),
        },
    ], [pathname])

    return paths
}