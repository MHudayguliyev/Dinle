import axios from 'axios'

const BASE_URL = 'http://95.85.125.44:4033/test/'
const axiosInstance = axios.create({
    baseURL: BASE_URL
})
export {axiosInstance, BASE_URL}