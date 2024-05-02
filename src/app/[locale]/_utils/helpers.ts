import authToken, { refreshAccessToken } from '@app/_api/Services/auth_token';
import moment from 'moment'
import hash from 'object-hash'
import { getFromStorage } from './storage';

export const toRem = (value: number): string => {
  return (value / 16) + 'rem';;
}
export const isEmpty = (str: string | any) => {
  if(typeof str === 'string' && typeof str !== 'undefined') return !str.trim()
}
export const isUndefined = (data:any): data is undefined | null => {
  return typeof data === 'undefined' || data === null
}
export const randomize = (max: number) => {
  return Math.floor(Math.random() * max) 
}
export const CheckObjOrArrForNull = (obj_or_arr: any) =>  {
    if (obj_or_arr !== null && obj_or_arr !== undefined) {
      if (obj_or_arr instanceof Object && Object.keys(obj_or_arr).length !== 0)
        return true;
      else if (Array.isArray(obj_or_arr) && obj_or_arr.length !== 0) return true;
    }
    return false;
}
export function secondsToMmSs(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Add leading zero for single-digit seconds
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  return `${minutes}:${formattedSeconds}`;
}
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
export function capitalize(str: string) {
    return str.split(' ').map(item => item[0].toUpperCase() + item.substring(1, item.length)).join(' ')
}
export function formatDurationDisplay(duration: number) {
    const min = Math.floor(duration / 60);
    const sec = Math.floor(duration - min * 60);
    const formatted = [min, sec].map((n) => (n < 10 ? "0" + n : n)).join(":"); // format - mm:ss
    return formatted;
}
export function handleBufferProgress(e: any) {
    const audio = e.currentTarget;
    const dur = audio.duration;
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) < audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i,
          );
          return bufferedLength;
        }
      }
    }
};
export const findIndex = (data: any, currentId: string) => {
  if(CheckObjOrArrForNull(data)) return data.findIndex((item:any) => item.id === currentId)
}
export function parse(data: string) {
  return JSON.parse(data)
}
export function stringify(data: any) {
  return JSON.stringify(data)
}
export function formatDate(date: string){
  const formatted = moment(date).format('DD MMMM.YYYY')
  return formatted
}

export const isAuthorized = () => {
  const user = parse(getFromStorage('authUser')!)
  const token = user?.access_token
  const expiresAt = user?.expiresAt
  const now = moment(new Date())
  if(expiresAt && token){
    // console.log('now.isSameOrAfter(expiresAt)',now.isSameOrAfter(expiresAt))
    if(now.isSameOrAfter(expiresAt)) return false
    return true
  }
  return false
}
export const getUserDevice = () => {
  if(typeof navigator !== 'undefined'){
    const userAgent = navigator.userAgent;
    const os = navigator.platform
    const browserNameMatch = userAgent.match(/(chrome|firefox|safari|ie|edge|opera|android|iphone|ipad)/i); // Case-insensitive matching
    const extractedBrowserName = browserNameMatch ? browserNameMatch[1] : 'Unknown';
    
    let browserVersionMatch;
    switch (extractedBrowserName.toLowerCase()) {
      case 'chrome':
        browserVersionMatch = userAgent.match(/Chrome\/(\d+\.\d+)?/i); // Extract major.minor version only
        break;
      case 'firefox':
        browserVersionMatch = userAgent.match(/Firefox\/(\d+\.\d+)?/i); // Extract major.minor version only
        break;
      case 'safari':
        browserVersionMatch = userAgent.match(/Version\/(\d+\.\d+).*?Safari/i); // Extract version before Safari
        break;
      case 'ie':
      case 'edge':
        browserVersionMatch = userAgent.match(/(MSIE\s|Trident\/\d+\.\d+.*;\srv:)(\d+\.\d+)?/i); // Handle IE/Edge versions
        break;
      case 'iphone':
      case 'ipad':
        browserVersionMatch = userAgent.match(/OS (\d+_?\d+)? like Mac OS X/i); // Extract major.minor version (may include underscore)
        break;
      case 'android': 
        browserVersionMatch = userAgent.match(/Android (\d+\.\d+)?/i); // Extract major.minor version only
        break;
      default:
        // Consider adding more cases for other browsers
    }
    const extractedBrowserVersion = browserVersionMatch ? browserVersionMatch[1] : null;
    const concatted = `${extractedBrowserName} - ${extractedBrowserVersion}`
    const id = hash(concatted, { encoding: 'base64'}).replaceAll(/\//g, '')
    return {os, id, name: extractedBrowserName, version: extractedBrowserVersion}
  }
  return null
}
export const copyLink = (link: string) => {
  if(typeof navigator !== 'undefined' && navigator.share) {
    const url = 'http://localhost:3000' + link
    const device = getUserDevice()
    const mode =  device?.name === 'Android' || device?.name === 'iPhone' ? 'mobile' : 'desktop'

    if(mode === 'desktop') 
    return new Promise((resolve, reject) => {
      navigator.clipboard.writeText(url).then(() => resolve(mode))
      .catch(error => reject(error))
    })
    return new Promise((resolve, reject) => {
      navigator.share({url})
        .then(() => resolve(mode))
        .catch(error => reject(error));
    });
  }
}