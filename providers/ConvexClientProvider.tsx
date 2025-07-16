// 'use client'
// import { Authenticated, AuthLoading, ConvexReactClient } from 'convex/react'
// import { ConvexProviderWithClerk } from 'convex/react-clerk'
// import { ClerkProvider, useAuth } from '@clerk/nextjs'
// import LoadingLogo from '@/components/shared/LoadingLogo';

// type Props = {
//     children: React.ReactNode;
// };

// const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || ""
// const convex = new ConvexReactClient(CONVEX_URL)

// const ConvexClientProvider = ({ children }: Props) => {
//     return (
//         <ClerkProvider>
//             <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
//                 <Authenticated>
//                     {children}
//                 </Authenticated>
//                 <AuthLoading>
//                     <LoadingLogo />
//                 </AuthLoading>
//             </ConvexProviderWithClerk>
//         </ClerkProvider>
//     )
// }

// export default ConvexClientProvider

'use client'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/nextjs'

type Props = {
    children: React.ReactNode;
};

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || ""
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""

const convex = new ConvexReactClient(CONVEX_URL)

const ConvexClientProvider = ({ children }: Props) => {
    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            appearance={{
                baseTheme: undefined,
                variables: {
                    colorPrimary: '#3b82f6',
                }
            }}
        >
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                    {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}

export default ConvexClientProvider