import React from 'react'

type Props = React.PropsWithChildren<{}>

const ChatLayout = ({children}: Props) => {
  return (
    <div>{children}</div>
  )
}

export default ChatLayout