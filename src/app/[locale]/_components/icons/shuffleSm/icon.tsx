import React from 'react'
import CommonIProps from '../CommonIProps'


interface ShuffleSmIProps extends CommonIProps {}
const ShuffleSmI = (props: ShuffleSmIProps) => {
  const {
      className = "", 
      onClick, 
  } = props

  return (
  <svg onClick={onClick} className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_4964_12822)">
  <path d="M8.82516 7.64232L4.5085 3.33398L3.3335 4.50898L7.64183 8.81732L8.82516 7.64232ZM12.0835 3.33398L13.7835 5.03398L3.3335 15.4923L4.5085 16.6673L14.9668 6.21732L16.6668 7.91732V3.33398H12.0835ZM12.3585 11.1757L11.1835 12.3507L13.7918 14.959L12.0835 16.6673H16.6668V12.084L14.9668 13.784L12.3585 11.1757Z" fill="white"/>
  </g>
  <defs>
  <clipPath id="clip0_4964_12822">
  <rect width="20" height="20" fill="white"/>
  </clipPath>
  </defs>
  </svg>
  )
}

export default ShuffleSmI
