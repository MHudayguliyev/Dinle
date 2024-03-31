import React from 'react';
import styles from './Switch.module.scss';
import classNames from 'classnames/bind';
import { capitalize } from '@utils/helpers';

export type Switch = {
   /** @default 'middle' */
   size?: 'small' | 'middle' | 'big'
   checked: boolean
   onClick: () => void
   /** @default false */
   disabled?: boolean
}

const cx = classNames.bind(styles)

const Switch = (props: Switch): JSX.Element => {
   const {
      size = 'middle',
      checked,
      onClick,
      disabled = false,
   } = props;

   return (
      <>
         <input disabled={disabled} type="checkbox" style={{ display: 'none' }} />
         <span onClick={() => onClick()} className={
            cx({
               switchWrapper: true,
               [`switchWrapper${capitalize(size)}`]: true,
            })
         }>
            <div className={
               cx({
                  circle: true,
                  [`circle${capitalize(size)}`]: true,
                  circleChecked: checked,
                  circleNotChecked: !checked,
               })
            } />
            <div className={
               cx({
                  track: true,
                  trackNotChecked: !checked,
                  trackPrimary: checked,
               })
            } />
         </span>
      </>
   )
}

export default Switch;