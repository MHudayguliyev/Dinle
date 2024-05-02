import React from 'react'
import CommonIProps from '../CommonIProps'

interface ArrowBottomIProps extends CommonIProps {}
const ArrowBottomI = React.forwardRef<SVGSVGElement, ArrowBottomIProps>((props, ref): JSX.Element => {
    const {
        className = "", 
        onClick, 
    } = props
    return (
        <svg onClick={onClick} ref={ref} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_3882_20121)">
        <path d="M9.2625 10.7375L7.5 12.5L15 20L22.5 12.5L20.7375 10.7375L15 16.4625L9.2625 10.7375Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_3882_20121">
        <rect width="30" height="30" fill="white" transform="matrix(0 -1 1 0 0 30)"/>
        </clipPath>
        </defs>
        </svg>
    )
})

export default ArrowBottomI
