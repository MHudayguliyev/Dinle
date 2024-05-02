import React from 'react'
import CommonIProps from '../CommonIProps'

interface LikeStaticIProps extends CommonIProps {}
const LikeStaticI = (props: LikeStaticIProps) => {
    const {
        className = ""
    } = props

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_7091_23883)">
    <path d="M28.3333 49.8167L24.95 46.7367C12.9333 35.84 5 28.6533 5 19.8333C5 12.6467 10.6467 7 17.8333 7C21.8933 7 25.79 8.89 28.3333 11.8767C30.8767 8.89 34.7733 7 38.8333 7C46.02 7 51.6667 12.6467 51.6667 19.8333C51.6667 28.6533 43.7333 35.84 31.7167 46.76L28.3333 49.8167Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_7091_23883">
    <rect width="56" height="56" fill="white"/>
    </clipPath>
    </defs>
    </svg>
  )
}

export default LikeStaticI
