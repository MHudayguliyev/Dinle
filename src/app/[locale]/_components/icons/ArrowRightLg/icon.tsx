import React from 'react'
import CommonIProps from '../CommonIProps'

interface ArrowRightIProps extends CommonIProps {}
const ArrowRightLgI = ({className = ""}: ArrowRightIProps) => {
  return (
<svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4341_6536)">
<path d="M4.41016 3.09L10.3202 9L4.41016 14.91L6.00016 16.5L13.5002 9L6.00016 1.5L4.41016 3.09Z" fill="#C1C1C1"/>
</g>
<defs>
<clipPath id="clip0_4341_6536">
<rect width="18" height="18" fill="white"/>
</clipPath>
</defs>
</svg>
  )
}

export default ArrowRightLgI