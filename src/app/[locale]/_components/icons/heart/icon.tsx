import React from 'react'
import classNames from 'classnames/bind'
import styles from './icon.module.scss'
import { motion } from 'framer-motion'

interface HeartIconProps {
    onClick?: (e: any) => void
    active: boolean
    className?: string
}
const cn = classNames.bind(styles)
const HeartIcon = (props:HeartIconProps) => {
  const {
    onClick,
    active, 
    className = "", 
  } = props

  return (
    <motion.div
      onClick={(e) => {
        if(onClick) onClick(e)
      }}
      whileTap={{ scale: 1.5 }}
    >
      {
        active ? (
            <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_4995_13288)">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#FF3740"/>
            </g>
            <defs>
            <clipPath id="clip0_4995_13288">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
            </svg>
        ) : (
            <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_4995_13291)">
            <path d="M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3ZM12.1 18.55L12 18.65L11.9 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 5.99 11.07 7.36H12.94C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_4995_13291">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
            </svg>
        )
      }
    </motion.div>
  )
}

export default HeartIcon