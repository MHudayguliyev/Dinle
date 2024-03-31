'use client';
import React from 'react'
//typed redux hook 
import { useAppSelector } from '@app/_hooks/redux_hooks';

const OverflowSetterProvider = ({children}: {children: React.ReactNode}) => {
    const isBlockOverflow = useAppSelector(state => state.overflowReducer.isBlockOverflow)

  return (
    <body style={{overflowY: `${isBlockOverflow ? 'hidden' : "auto"}`}}>{children}</body>
  )
}

export default OverflowSetterProvider