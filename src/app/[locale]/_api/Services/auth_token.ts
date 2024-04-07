import { parse } from "@app/_utils/helpers"
import { getFromStorage, setToStorage } from "@app/_utils/storage"
import axios from "axios"
import { api } from "./api_helpers"
import moment from "moment"

export default function authToken() {
    if(typeof window !== 'undefined'){
        const data = localStorage.getItem("authUser") as string
        const obj = JSON.parse(data)
        if (obj && obj.access_token) {
            return obj.access_token
        } return null
    }
}


export async function refreshAccessToken(){
    const data = getFromStorage('authUser')
    let obj;

    try {
        obj = parse(data ? data : "")
    } catch (error) {
        obj = { refresh_token: "" }
    }

    try {
        const response:any = await api.post({
            url: '/auth/refresh',
            data: {refresh: obj.refresh_token}
        })

        
        if(response.success && response.statusCode === 200){
            const tommorrow = moment(new Date()).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
            setToStorage('authUser', JSON.stringify({...obj, access_token: response.data.token, expiresAt: tommorrow}))
            return false
        } else return true
    } catch (error) {
        if(axios.isAxiosError(error)){
            console.log(error.response)
            localStorage.removeItem('authUser')
        }
        console.log(error)
        return true
    }
}