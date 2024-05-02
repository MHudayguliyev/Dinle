import React from 'react'
import { motion } from 'framer-motion'
import CommonIProps from '../CommonIProps'

interface BackAndForthIconTypes extends CommonIProps {
    /** @defaultValue pause **/
    direction:  'back' | 'forward'
    onClick?: () => void
}
const BackAndForth = (props: BackAndForthIconTypes) => {
    const {
        disable = false, 
        direction, 
        onClick, 
        className = ""
    } = props

    const handleClick = (e:any) => {
        e.stopPropagation()
        if(onClick) onClick()
    }

  return (
    <motion.div whileTap={{ scale: 0.9 }} style={{outline: 'none'}} className={className} onClick={handleClick}>
        {
            direction === 'back' ? (
                <svg  width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 14.5L4.58333 7.5L14.5 0.5V14.5ZM2.83333 0.5V14.5H0.5V0.5H2.83333Z" fill="white"/>
                </svg>
            ) : (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 14.5L10.4167 7.5L0.5 0.5V14.5ZM12.1667 0.5V14.5H14.5V0.5H12.1667Z" fill="white"/>
                </svg>
            )
        }
    </motion.div>
  )
}

export default BackAndForth