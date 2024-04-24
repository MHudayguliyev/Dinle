import React, { useRef, useEffect } from 'react'
//styles
import styles from './TopNavbar.module.scss'
import { useWindowScrollPositions } from '@app/_hooks/useWindowOffset'

interface TopNavbarProps {
    renderOptions: () => React.ReactNode
    renderActions?: () => React.ReactNode
    className: string
}

const TopNavbar = (props: TopNavbarProps) => {
    const {
        renderOptions, 
        renderActions, 
        className = ""
    } = props
    const headerRef:any = useRef(null)
    const { scrolly } = useWindowScrollPositions()

    useEffect(() => {
        const opacity = Math.min(1, scrolly / window.innerHeight)
        if(headerRef && headerRef.current)
        headerRef.current?.style?.setProperty(
            '--opacity', opacity
        )
    }, [scrolly, headerRef])


  return (
    <div >
        <div className={`${styles.header} ${className}`} ref={headerRef}>
            {renderOptions && renderOptions()}
            {renderActions && renderActions()}
        </div>
    </div>
  )
}

export default TopNavbar
