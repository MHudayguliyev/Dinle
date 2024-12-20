import React from 'react'
import CommonIProps from '../CommonIProps'

interface PlayPauseIconProps extends CommonIProps {
    state?: 'play' | 'pause'
}

const PlayPause = React.forwardRef<SVGSVGElement, PlayPauseIconProps>((props, ref): JSX.Element => {
    const {
        className = "", 
        onClick, 
        state = 'play', 
    } = props

    const handleClick = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        if(onClick) onClick()
    }

    return (
        <>
            {
                state === 'play' ? 
                <svg onClick={handleClick} className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_b_5414_13156)">
                <g clip-path="url(#clip0_5414_13156)">
                <rect width="40" height="40" rx="20" fill="black" fill-opacity="0.2"/>
                </g>
                </g>
                <path d="M15.53 10.9562C14.8639 10.54 14 11.0188 14 11.8042V28.1958C14 28.9812 14.864 29.46 15.53 29.0438L28.6432 20.848C29.2699 20.4563 29.2699 19.5437 28.6432 19.152L15.53 10.9562Z" fill="white"/>
                <defs>
                <filter id="filter0_b_5414_13156" x="-28" y="-28" width="96" height="96" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="14"/>
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5414_13156"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5414_13156" result="shape"/>
                </filter>
                <clipPath id="clip0_5414_13156">
                <rect width="40" height="40" rx="20" fill="white"/>
                </clipPath>
                </defs>
                </svg>
                : ""
            }
        </>
    )
})

PlayPause.displayName = 'PlayPause'

export default PlayPause