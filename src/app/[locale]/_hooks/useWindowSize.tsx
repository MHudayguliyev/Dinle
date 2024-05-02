import { useState, useEffect } from 'react';
const useWindowSize = (): Array<number> => {
   const [width, setWidth] = useState<number>(0);
   const [height, setHeight] = useState<number>(0);

   useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== 'undefined') {
         // Handler to call on window resize
         const handleResize = () => {
            // Sdow width/height to stateet win
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
         }

         // Add event listener
         window.addEventListener("resize", handleResize);

         // Call handler right away so state gets updated with initial window size
         handleResize();

         // Remove event listener on cleanup
         return () => window.removeEventListener("resize", handleResize);
      }
   }, []); // Empty array ensures that effect is only run on mount
   return [width, height];
}

export default useWindowSize