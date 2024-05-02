import React from 'react'

interface ArrowIProps {
  onClick?: () => void
}
const ArrowI = (props: ArrowIProps) => {
  const {
    onClick
  } = props

  return (
    <svg onClick={onClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_6076_20439)">
    <path d="M7.1582 6.175L10.9749 10L7.1582 13.825L8.3332 15L13.3332 10L8.3332 5L7.1582 6.175Z" fill="#C1C1C1"/>
    </g>
    <defs>
    <clipPath id="clip0_6076_20439">
    <rect width="20" height="20" fill="white" transform="matrix(0 -1 1 0 0 20)"/>
    </clipPath>
    </defs>
    </svg>
  )
}

export default ArrowI