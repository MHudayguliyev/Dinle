import axios from 'axios'
import {parseCookies} from 'nookies'

const cookies = parseCookies()
const locale = cookies['NEXT_LOCALE']
const BASE_URL = process.env.API_URL
const axiosInstance = axios.create({
    baseURL: BASE_URL, 
    headers: {
        "Accept-Language": locale
    }
})

export {axiosInstance, BASE_URL}    