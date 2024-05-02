import React from 'react'
import CommonIProps from '../CommonIProps'
import { motion } from 'framer-motion'


interface SimplePlayI extends CommonIProps {
    /** @defaultValue play **/
    mode?: 'play' | 'pause'
}
const SimplePlayI = (props: SimplePlayI) => {
    const {
        onClick, 
        mode = 'play', 
        className = "", 
        disable = false, 
    } = props

  return (
    <motion.div 
      whileTap={{ scale: 0.9 }}
      style={{outline: 'none'}}
      aria-label={mode === 'pause' ? 'Pause' : 'Play'}
      onClick={onClick} 
    >
      {
        mode === 'pause' ? (
          <svg className={className} width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="59.2727" height="59.2727" rx="29.6364" fill="white"/>
          <g clip-path="url(#clip0_4995_13270)">
          <path d="M21.6364 37.9694C21.6364 38.5217 22.0841 38.9694 22.6364 38.9694H25.9697C26.522 38.9694 26.9697 38.5217 26.9697 37.9694V21.3027C26.9697 20.7504 26.522 20.3027 25.9697 20.3027H22.6364C22.0841 20.3027 21.6364 20.7504 21.6364 21.3027V37.9694ZM33.303 20.3027C32.7507 20.3027 32.303 20.7504 32.303 21.3027V37.9694C32.303 38.5217 32.7507 38.9694 33.303 38.9694H36.6364C37.1886 38.9694 37.6364 38.5217 37.6364 37.9694V21.3027C37.6364 20.7504 37.1886 20.3027 36.6364 20.3027H33.303Z" fill="#323232"/>
          </g>
          <defs>
          <clipPath id="clip0_4995_13270">
          <rect width="32" height="32" fill="white" transform="translate(13.6364 13.6367)"/>
          </clipPath>
          </defs>
          </svg>
        ) : (
        <svg style={{pointerEvents: `${disable ? 'none': 'auto'}`}} className={className} width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="59.2727" height="59.2727" rx="29.6364" fill="white"/>
        <path d="M40.2796 30.4861C40.9063 30.0945 40.9063 29.1818 40.2796 28.7901L21.8331 17.261C21.1671 16.8448 20.3031 17.3236 20.3031 18.109V41.1672C20.3031 41.9527 21.1671 42.4315 21.8331 42.0152L40.2796 30.4861Z" fill="#202020"/>
        </svg>
        )
      }
    </motion.div>

  )
}

export default SimplePlayI