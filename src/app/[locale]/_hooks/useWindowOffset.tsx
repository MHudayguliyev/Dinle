import { useEffect, useState } from 'react'

export const useWindowScrollPositions = () => {

   const [scrollposition, setposition] = useState({ scrollx: 0, scrolly: 0 })

   useEffect(() => {
    function updateposition() {
        setposition({ scrollx: window.scrollX, scrolly: window.scrollY })
    }

    window.addEventListener('scroll', updateposition)
    updateposition()

    return () => window.removeEventListener('scroll', updateposition)
   }, [])

   return scrollposition
}