import React from 'react'
import CommonIProps from '../CommonIProps'

interface ChevronBottomSmIProps extends CommonIProps {}
const ChevronBottomSmI = React.forwardRef<SVGSVGElement, ChevronBottomSmIProps>((props, ref): JSX.Element => {
  const {
      className = ""
  } = props

return (
  <svg ref={ref} className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.20694 7.73271C3.92125 8.03263 3.93279 8.50737 4.23271 8.79306L9.48318 13.7944C9.77285 14.0703 10.2281 14.0703 10.5178 13.7944L15.7682 8.79306C16.0681 8.50737 16.0797 8.03263 15.794 7.73271C15.5083 7.43279 15.0336 7.42125 14.7336 7.70694L10.0005 12.2155L5.26729 7.70694C4.96737 7.42125 4.49264 7.43279 4.20694 7.73271Z" fill="#5E5E62"/>
  </svg>
)
})

export default ChevronBottomSmI
