import React, { RefObject, useEffect, useState } from "react";

const useClickOutside = <T extends HTMLElement = HTMLElement, U extends HTMLElement = HTMLElement>
   (contentRef: RefObject<T>, toggleRef: RefObject<U>, clickType: any): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
   const [show, setShow] = useState<boolean>(false);
   useEffect(() => {
      const maybeHandler = (event: MouseEvent) => {
         if (contentRef.current && toggleRef.current?.contains(event.target as Node)) {
            setShow(!show)
         } else {
            // user click outside toggle and content
            if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
               setShow(false)
            }
         }
      };
      document.addEventListener(clickType, maybeHandler);
      return () => {
         document.removeEventListener(clickType, maybeHandler);
      };
   });
   return [show, setShow];
}

export default useClickOutside;