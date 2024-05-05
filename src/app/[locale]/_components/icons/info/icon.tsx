import React from 'react'
import CommonIProps from '../CommonIProps'

interface InfoIProps extends CommonIProps {}
const InfoI = React.forwardRef<SVGSVGElement, InfoIProps>((props, ref): JSX.Element => {
    const {
      onClick
    } = props

    const handleClick = (e: any) => {
      e.stopPropagation()
      if(onClick) onClick()
    }

  return (
    <svg onClick={handleClick} ref={ref} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_b_4964_12261)">
        <rect width="40" height="40" rx="20" fill="white" fill-opacity="0.05"/>
        <path d="M19.1667 24.166H20.8334V19.166H19.1667V24.166ZM20.0001 11.666C15.4001 11.666 11.6667 15.3993 11.6667 19.9993C11.6667 24.5993 15.4001 28.3327 20.0001 28.3327C24.6001 28.3327 28.3334 24.5993 28.3334 19.9993C28.3334 15.3993 24.6001 11.666 20.0001 11.666ZM20.0001 26.666C16.3251 26.666 13.3334 23.6743 13.3334 19.9993C13.3334 16.3243 16.3251 13.3327 20.0001 13.3327C23.6751 13.3327 26.6667 16.3243 26.6667 19.9993C26.6667 23.6743 23.6751 26.666 20.0001 26.666ZM19.1667 17.4993H20.8334V15.8327H19.1667V17.4993Z" fill="white"/>
        <path d="M19.1667 15.834H20.8334V17.5007H19.1667V15.834ZM19.1667 19.1673H20.8334V24.1673H19.1667V19.1673Z" fill="white"/>
        <path d="M20.0001 11.666C15.4001 11.666 11.6667 15.3993 11.6667 19.9993C11.6667 24.5993 15.4001 28.3327 20.0001 28.3327C24.6001 28.3327 28.3334 24.5993 28.3334 19.9993C28.3334 15.3993 24.6001 11.666 20.0001 11.666ZM20.0001 26.666C16.3251 26.666 13.3334 23.6743 13.3334 19.9993C13.3334 16.3243 16.3251 13.3327 20.0001 13.3327C23.6751 13.3327 26.6667 16.3243 26.6667 19.9993C26.6667 23.6743 23.6751 26.666 20.0001 26.666Z" fill="white"/>
        </g>
        <defs>
        <filter id="filter0_b_4964_12261" x="-33" y="-33" width="106" height="106" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="16.5"/>
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_4964_12261"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_4964_12261" result="shape"/>
        </filter>
        </defs>
    </svg>
  )
})
InfoI.displayName = 'InfoI'
export default InfoI