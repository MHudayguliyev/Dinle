import axios from 'axios'

const BASE_URL = 'https://dinle.com.tm/api'
const axiosInstance = axios.create({
    baseURL: BASE_URL
})
export {axiosInstance, BASE_URL}