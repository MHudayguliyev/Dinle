import axios from 'axios'

const BASE_URL = process.env.API_URL
const axiosInstance = axios.create({
    baseURL: BASE_URL
})
export {axiosInstance, BASE_URL}    