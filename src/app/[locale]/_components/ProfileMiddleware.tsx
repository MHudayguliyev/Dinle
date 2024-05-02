'use client';
import React, { useEffect } from 'react'
import { useAppDispatch } from '@hooks/redux_hooks'
import authToken from '@api/Services/auth_token';
import { setIsAuthenticated } from '@redux/reducers/AuthReducer';

const ProfileMiddleware = ({children}:{children: React.ReactNode}) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(authToken()) 
        dispatch(setIsAuthenticated(true))
    }, [])

    return (<>{children}</>)
}

export default ProfileMiddleware