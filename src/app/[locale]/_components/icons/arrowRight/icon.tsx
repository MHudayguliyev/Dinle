import React from 'react'
import CommonIProps from '../CommonIProps'

interface ArrowRightIProps extends CommonIProps {}
const ArrowRightI = ({className = ""}: ArrowRightIProps) => {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_8644_30213)">
    <path d="M5.72699 11.06L8.78033 8L5.72699 4.94L6.66699 4L10.667 8L6.66699 12L5.72699 11.06Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_8644_30213">
    <rect width="16" height="16" fill="white" transform="matrix(-1 0 0 1 16 0)"/>
    </clipPath>
    </defs>
    </svg>
  )
}

export default ArrowRightI