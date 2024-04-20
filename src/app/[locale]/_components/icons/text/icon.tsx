import React from 'react'
import styles from './icon.module.scss'

interface TextIProps {
    onClick?: () => void
    active: boolean
    /** @default false **/
    noLyricFound?: boolean
}
const TextI = React.forwardRef<SVGSVGElement, TextIProps>((props, ref): JSX.Element => {
    const {
        onClick, 
        active, 
        noLyricFound = false, 
    } = props
    return (
        <div onClick={onClick} className={noLyricFound ? styles.notFound : ""}>
            {
                active ? (
                    <svg ref={ref} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_4995_13253)">
                    <path d="M2.5 4V7H7.5V19H10.5V7H15.5V4H2.5ZM21.5 9H12.5V12H15.5V19H18.5V12H21.5V9Z" fill="#FF3740"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_4995_13253">
                    <rect width="24" height="24" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                ) : 
                (
                    <svg ref={ref} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_4995_13251)">
                    <path d="M2.5 4V7H7.5V19H10.5V7H15.5V4H2.5ZM21.5 9H12.5V12H15.5V19H18.5V12H21.5V9Z" fill="#B3B3B3"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_4995_13251">
                    <rect width="24" height="24" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                )
            }
        </div>
    )
})

export default TextI