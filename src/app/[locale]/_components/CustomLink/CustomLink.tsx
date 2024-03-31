import Link, { LinkProps } from 'next/link'
import React from 'react'

interface CustomLinkProps extends LinkProps {
    children: React.ReactNode
    /** @default false */
    scroll?: boolean
    className?: string
}
const CustomLink = (props: CustomLinkProps) => {
    const {
        children, 
        scroll = false, 
        className = ""
    } = props
  return (
    <Link className={className} {...props} scroll={scroll}>
        {children}
    </Link>
  )
}

export default CustomLink