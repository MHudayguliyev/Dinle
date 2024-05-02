import React from 'react'
import CommonIProps from '../CommonIProps'

interface TrashIProps extends CommonIProps {}
const TrashI = (props: TrashIProps) => {
  const {
    className = "", 
    onClick
  } = props

  return (
    <svg onClick={onClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#cl`ip0_7091_23809)">
    <path d="M13.3337 7.5V15.8333H6.66699V7.5H13.3337ZM12.0837 2.5H7.91699L7.08366 3.33333H4.16699V5H15.8337V3.33333H12.917L12.0837 2.5ZM15.0003 5.83333H5.00033V15.8333C5.00033 16.75 5.75033 17.5 6.66699 17.5H13.3337C14.2503 17.5 15.0003 16.75 15.0003 15.8333V5.83333Z" fill="#C1C1C1"/>
    </g>
    <defs>
    <clipPath id="clip0_7091_23809">
    <rect width="20" height="20" fill="white"/>
    </clipPath>
    </defs>
    </svg>
  )
}

export default TrashI
