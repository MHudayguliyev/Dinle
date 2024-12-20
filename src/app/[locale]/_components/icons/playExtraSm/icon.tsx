import React from 'react'
import CommonIProps from '../CommonIProps'

interface PlayExtraSmIProps extends CommonIProps {
  mode: 'play' | 'pause'
}

const PlayExtraSm = (props: PlayExtraSmIProps) => {
  const {
    className = "", 
    mode
  } = props

  return (
    <>
      {
        mode === 'play' ? 
        <svg className={className} width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1892_16538)">
        <path d="M19.6176 14.6274C20.1275 14.3486 20.1275 13.6514 19.6176 13.3726L8.14706 7.09815C7.63726 6.81928 7 7.16786 7 7.72559V20.2744C7 20.8321 7.63725 21.1807 8.14706 20.9019L19.6176 14.6274Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_1892_16538">
        <rect width="28" height="28" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        : 
        <svg className={className}  width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1892_16541)">
        <rect x="8" y="7" width="4" height="14" rx="1" fill="white"/>
        <rect x="16" y="7" width="4" height="14" rx="1" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_1892_16541">
        <rect width="28" height="28" fill="white"/>
        </clipPath>
        </defs>
        </svg>
      }
    </>
  )
}

export default PlayExtraSm
