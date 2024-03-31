import axios from 'axios'

const BASE_URL = 'http://216.250.12.114:4033/test/'
const axiosInstance = axios.create({
    baseURL: BASE_URL
})
export {axiosInstance, BASE_URL}