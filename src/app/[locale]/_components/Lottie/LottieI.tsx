import React from 'react'
import Lottie from 'react-lottie';

interface LottieIProps {
  width: number
  height: number
  icon: any
  className?: string 
}
const LottieI = (props: LottieIProps) => {
  const {
    width = 250, 
    height = 250, 
    icon, 
    className = ""
  } = props

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: icon,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice", 
      className: className
    }
};

  return (
    <Lottie 
      options={defaultOptions}
      height={height}
      width={width}
      style={{margin: '0'}}
    />
  )
}

export default LottieI
