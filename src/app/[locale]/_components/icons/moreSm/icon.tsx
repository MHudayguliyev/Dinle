import React from 'react'
import CommonIProps from '../CommonIProps'

interface MoreIProps extends CommonIProps {}
const MoreSm = React.forwardRef<SVGSVGElement, MoreIProps>((props, ref): JSX.Element => {
    const {
        onClick, 
        className = ""
    } = props

    const handleClick = (e:any) => {
        e.stopPropagation()
        if(onClick) onClick()
    }

    return (
        <svg ref={ref} className={className} onClick={handleClick} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="1" fill="#B3B3B3" stroke="#B3B3B3" stroke-width="2" stroke-linecap="round"/>
        <circle cx="6" cy="12" r="1" fill="#B3B3B3" stroke="#B3B3B3" stroke-width="2" stroke-linecap="round"/>
        <circle cx="18" cy="12" r="1" fill="#B3B3B3" stroke="#B3B3B3" stroke-width="2" stroke-linecap="round"/>
        </svg>
    )
})
MoreSm.displayName = 'MoreSm'

export default MoreSm