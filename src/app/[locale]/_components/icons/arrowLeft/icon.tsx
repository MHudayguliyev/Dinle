import React from 'react'
import CommonIProps from '../CommonIProps'
interface ArrowLeftIProps extends CommonIProps {}

const ArrowLeftI = ({className = ""}: ArrowLeftIProps) => {
  return (
    <svg className={className} width="18" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_8644_30199)">
    <path d="M10.273 11.56L7.21967 8.5L10.273 5.44L9.33301 4.5L5.33301 8.5L9.33301 12.5L10.273 11.56Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_8644_30199">
    <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
    </clipPath>
    </defs>
    </svg>
  )
}

export default ArrowLeftI