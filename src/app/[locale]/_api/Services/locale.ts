import { cookies } from 'next/headers'

export function getLocale(){
    const cookieStore = cookies()
    const NEXT_LOCALE = cookieStore.get('NEXT_LOCALE')
    return NEXT_LOCALE
    console.log('NEXT_LOCALE', NEXT_LOCALE)
}