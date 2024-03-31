export const setToStorage = (key: string, value: string) => {
    if(typeof localStorage !== 'undefined') return localStorage.setItem(key, value)
    return null
}
export const getFromStorage = (key: string) => {
    if(typeof localStorage !== 'undefined') return localStorage.getItem(key)
    return null
}
export const removeFromStorage = (key: string) => {
    if(typeof localStorage !== 'undefined') return localStorage.removeItem(key)
    return null
}