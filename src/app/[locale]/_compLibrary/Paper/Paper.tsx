import React from 'react';
import styles from './Paper.module.scss';
import classNames from 'classnames/bind';
import { CSSProperties } from 'react';

const cx = classNames.bind(styles);

type PaperProps = {
   children: React.ReactNode
   /** @defaultValue false */
   circle?: boolean
   /** @defaultValue false */
   rounded?: boolean
   /** @defaultValue false */
   topRounded?: boolean
   /** @defaultValue false */
   bottomRounded?: boolean
   /** @defaultValue false */
   leftRounded?: boolean
   /** @defaultValue false */
   rightRounded?: boolean
   /** @defaultValue false */
   fullWidth?: boolean
   /** @defaultValue false */
   fullHeight?: boolean
   style?: CSSProperties
   className?: string
   removeShadow?: boolean
}

const Paper = (props: PaperProps): JSX.Element => {
   const {
      children,
      rounded = false,
      topRounded = false,
      bottomRounded = false,
      leftRounded = false,
      rightRounded = false,
      circle = false,
      fullWidth = false,
      fullHeight = false,
      style,
      className = '',
      removeShadow = false
   } = props;

   return (
      <div style={style} className={`${className} ${cx({
         paper: true,
         rounded: rounded,
         topRounded: topRounded,
         bottomRounded: bottomRounded,
         leftRounded: leftRounded,
         rightRounded: rightRounded,
         circle: circle,
         fullWidth: fullWidth,
         fullHeight: fullHeight,
         removeShadow: removeShadow
      })
         }`

      }>
         {children}
      </div >
   )
}

export default Paper;