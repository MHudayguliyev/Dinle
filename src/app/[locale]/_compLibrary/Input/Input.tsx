import React, { InputHTMLAttributes, ReactNode, useRef } from "react";
import Image from "next/image";
// custom styles
import styles from './Input.module.scss';
import classNames from 'classnames/bind';
// helpers
import { capitalize } from "@utils/helpers";

const cn = classNames.bind(styles);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
   /** @defaultValue medium */
   fontSize?: 'small' | 'medium' | 'big'
   /** @defaultValue medium */
   fontWeight?: 'normal' | 'medium' | 'bold'
   /** @defaultValue transparent */
   outline?: 'dark' | 'light' | 'orange' | 'transparent'
   autoFocus?: boolean
   rightIcon?: React.ReactNode
   leftIcon?: React.ReactNode
   /** @deafultValue false **/ 
   showLoginMask?: boolean
   /** @defaultValue false **/
   rounded?: boolean
   /** @defaultValue false **/
   roundedSm?: boolean
   /** @defaultValue false **/
   removeDefaultBg?: boolean
   /** @defaultValue false **/
   removeDefaultWidth?: boolean
   onRightClick?: () => void
   onLeftClick?: () => void
   /** @defaultValue false **/
   hideEndIcon?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref): JSX.Element => {
   const {
      fontSize = 'medium',
      fontWeight = 'medium',
      outline = 'transparent', 
      className = "",
      autoFocus,
      rightIcon,
      leftIcon, 
      showLoginMask, 
      rounded = false, 
      roundedSm = false, 
      removeDefaultBg = false, 
      removeDefaultWidth = false, 
      hideEndIcon = false, 
      onRightClick, 
      onLeftClick,
   } = props;

   return (
      <div className={cn({
         input__parent_container: true, 
         rounded: rounded, 
         roundedSm: roundedSm, 
         removeBg: removeDefaultBg,
         [`outline${capitalize(outline)}`]: true, 
      })}>
         <div className={cn({
            baseStyle: true, 
            width: !removeDefaultWidth
         })}>
            {
               leftIcon && (
                  <div className={styles.leftIcon} onClick={onLeftClick}>
                     {leftIcon}
                  </div>
               )
            }
            {
               showLoginMask && (
                  <div className={styles.mask}>
                     <span>+993</span>
                     <span>|</span>
                  </div>
               )
            }
            <input autoFocus={autoFocus} ref={ref} {...props} className={`${className} ${cn({
               input: true,
               [`leftPad${leftIcon ? capitalize('icon') : capitalize('mask')}`]: (leftIcon || showLoginMask), 
               [`fontSize${capitalize(fontSize)}`]: true,
               [`fontWeight${capitalize(fontWeight)}`]: true,
            })}
            `} />
         </div>
         {
            rightIcon && !hideEndIcon && (
               <div className={styles.rightIcon} onClick={onRightClick}>
                  {rightIcon}
               </div>
            )
         }  
      </div>
   )
})

Input.displayName = 'Input'
export default Input;