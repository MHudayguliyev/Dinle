import React from 'react'

interface CloseIProps {
  onClick?: (event: any) => void
  className?: string
}
const CloseI = (props: CloseIProps) => {
  const {
    onClick, 
    className = "", 
  } = props

  const styles = {
    cursor: 'pointer'
  }

  return (
    <svg className={className} style={styles} onClick={onClick}  width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_b_4964_16737)">
    <rect width="44" height="44" rx="8" fill="#3C3C3C" fill-opacity="0.15"/>
    <g clip-path="url(#clip0_4964_16737)">
    <path d="M29 16.41L27.59 15L22 20.59L16.41 15L15 16.41L20.59 22L15 27.59L16.41 29L22 23.41L27.59 29L29 27.59L23.41 22L29 16.41Z" fill="#C1C1C1"/>
    </g>
    </g>
    <defs>
    <filter id="filter0_b_4964_16737" x="-33" y="-33" width="110" height="110" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feGaussianBlur in="BackgroundImageFix" stdDeviation="16.5"/>
    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_4964_16737"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_4964_16737" result="shape"/>
    </filter>
    <clipPath id="clip0_4964_16737">
    <rect width="24" height="24" fill="white" transform="translate(10 10)"/>
    </clipPath>
    </defs>
    </svg>
  )
}

export default CloseI