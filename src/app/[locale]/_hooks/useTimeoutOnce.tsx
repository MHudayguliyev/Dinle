import { useEffect, useState } from "react";

const UseTimeoutOnce = (callback: Function, delay = 15000) => { 
    const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
  
    useEffect(() => {
      if (!hasTimedOut) { // Ensure timeout happens only once
        const timerId = setTimeout(() => {
          setHasTimedOut(true); 
          callback();
        }, delay);
  
        return () => clearTimeout(timerId);
      }
    }, [hasTimedOut, callback, delay]); 
}
export default UseTimeoutOnce;