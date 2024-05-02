import React from 'react'
import CommonIProps from '../CommonIProps'

interface ShareIProps extends CommonIProps {}
const ShareI = React.forwardRef<SVGSVGElement, ShareIProps>((props, ref): JSX.Element => {
    const {
        onClick
    } = props

    return (
        <svg ref={ref} onClick={onClick} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b_4964_12264)">
            <rect width="40" height="40" rx="20" fill="white" fill-opacity="0.05"/>
            <g clip-path="url(#clip0_4964_12264)">
            <path d="M25 23.3993C24.3667 23.3993 23.8 23.6494 23.3667 24.041L17.425 20.5827C17.4667 20.391 17.5 20.1993 17.5 19.9993C17.5 19.7993 17.4667 19.6077 17.425 19.416L23.3 15.991C23.75 16.4077 24.3417 16.666 25 16.666C26.3833 16.666 27.5 15.5493 27.5 14.166C27.5 12.7827 26.3833 11.666 25 11.666C23.6167 11.666 22.5 12.7827 22.5 14.166C22.5 14.366 22.5333 14.5577 22.575 14.7493L16.7 18.1743C16.25 17.7577 15.6583 17.4993 15 17.4993C13.6167 17.4993 12.5 18.616 12.5 19.9993C12.5 21.3827 13.6167 22.4993 15 22.4993C15.6583 22.4993 16.25 22.241 16.7 21.8243L22.6333 25.291C22.5917 25.466 22.5667 25.6493 22.5667 25.8327C22.5667 27.1743 23.6583 28.266 25 28.266C26.3417 28.266 27.4333 27.1743 27.4333 25.8327C27.4333 24.491 26.3417 23.3993 25 23.3993Z" fill="white"/>
            </g>
            </g>
            <defs>
            <filter id="filter0_b_4964_12264" x="-33" y="-33" width="106" height="106" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="16.5"/>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_4964_12264"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_4964_12264" result="shape"/>
            </filter>
            <clipPath id="clip0_4964_12264">
            <rect width="20" height="20" fill="white" transform="translate(10 10)"/>
            </clipPath>
            </defs>
            </svg>
    )
})

export default ShareI