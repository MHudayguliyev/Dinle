import React, { CSSProperties, ReactNode, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
//icons 
import Close from '@components/icons/close/icon'
//styles
import styles from './Modal.module.scss';
import classNames from "classnames/bind";

const cn = classNames.bind(styles);
interface KeyboardEvent {
   key: string;
   preventDefault: Function
}

type ModalProps = {
   isOpen: boolean
   close: Function
   children: ReactNode
   footer?: ReactNode
   /** @default false */
   fullScreen?: boolean
   /** @default false */
   hideClose?: boolean
   /** @default false */
   notEntireScreen?: boolean
   className?: string
   style?: CSSProperties
   styleOfModalBody?:CSSProperties
   removeOutClick?: boolean
   onClick?: () => void
   onExitFullScreen?: () => void
}
function Modal (props: ModalProps) {
   const {
      isOpen,
      close,
      children,
      footer,
      fullScreen = false,
      notEntireScreen = false, 
      hideClose = false, 
      removeOutClick = false, 
      className = '',
      style,
      styleOfModalBody, 
      onClick, 
      onExitFullScreen
   } = props;

   const [isClient, setIsClient] = useState(false);
   useEffect(() => {
     setIsClient(true);
   }, []);
   
   useEffect(() => {
      if (isOpen)
         document.getElementsByTagName('body')[0].classList.add('modal-opened');
      else
         document.getElementsByTagName('body')[0].classList.remove('modal-opened');
   }, [isOpen])

   // keydown listener for 'escape' key
   useEffect(() => {
      const keyDownHandler = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            event.preventDefault();
            close()
         }
      }
      document.addEventListener('keydown', keyDownHandler);
      return () => {
         document.removeEventListener('keydown', keyDownHandler);
      };
   }, []);


   const modalContent = isOpen ? (
      <div className={
         cn({
            modal: true,
            notEntireScreen: notEntireScreen, 
            notFullScreenModal: !fullScreen
         })
      } onClick={() => {
         if(!removeOutClick) close()
      }}>
         <div className={styles.wrapper}>
            <div onClick={onClick && onClick} style={style} className={`${className} ${cn({
                  modalContent: true,
                  modalAnimation: isOpen,
                  fullScreen: fullScreen
               })}
            `}>
               <div style={styleOfModalBody} className={styles.modalBody} onClick={e => e.stopPropagation()}>
                     <Close  onClick={e => close()}
                     className={cn({
                        closeI: true, 
                        hideCloseI: hideClose
                     })}
                     />
                  {children}
               </div>
               <div className={styles.modalFooter} >
                  {footer}
               </div>
            </div>
         </div>
      </div>
   ) : null;

   if (!isClient) {
      return null;
    }
   return ReactDOM.createPortal(
      <div>
         {modalContent}
      </div>,
      document.body as HTMLElement
   );
}
export default Modal;