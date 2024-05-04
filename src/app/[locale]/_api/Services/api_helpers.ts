import { axiosInstance } from '../axiosInstance'    
import authToken from './auth_token'


interface ApiProps<T> {
    url: string 
    config?: {}
}

interface CommonType<T> extends ApiProps<T>{
    data: T
}

const privateConfig = {
    headers: {
      "Authorization": "", 
      "Content-type": "application/json", 
    }, 
}

const api = {
    get: async <T>(props: ApiProps<T>): Promise<T> => {
        const {
            url, 
            config
        } = props
        return axiosInstance.get(url,  {...config}).then(response => {
            if(response.data.data) return response.data.data
            return response.data
        })
    }, 
    getPrivate: async <T>(props: ApiProps<T>): Promise<T> => {
        const {
            url, 
        } = props
        const token = 'Bearer ' + authToken()
        return axiosInstance.get(url,  {
            ...privateConfig,  headers: {
              ...privateConfig.headers, Authorization: token
            }
        }).then(response => {
            if(response.data.data) return response.data.data
            return response.data
        })
    }, 
    post: async <T, R>(props: CommonType<T>): Promise<R> => {
        const {
            url, 
            config, 
            data
        } = props
        return axiosInstance.post(url,  {...data}, {...config}).then(response => response.data)
    }, 
    postPrivate: async <T, R>(props: CommonType<T>): Promise<R> => {
        const {
            url, 
            data
        } = props
        const token = 'Bearer ' + authToken()
        return axiosInstance.post(url,  {...data}, {
            ...privateConfig,  headers: {
              ...privateConfig.headers, Authorization: token
            }
        }).then(response => response.data)
    }, 
    patch: async <T, R>(props: CommonType<T>): Promise<R> => {
        const {
            url, 
            config, 
            data
        } = props
        return axiosInstance.patch(url, {...data}, {...config}).then(response => {
            // if(response.data.data) return response.data.data
            return response.data
        })
    }, 
    patchPrivate: async <T, R>(props: CommonType<T>): Promise<R> => {
        const {
            url, 
            data
        } = props
        const token = 'Bearer ' + authToken()
        return axiosInstance.patch(url, {...data}, {
            ...privateConfig,  headers: {
              ...privateConfig.headers, Authorization: token
            }
        }).then(response => {
            return response.data
        })
    }, 
    patchDynamic: async <T, R>(props: CommonType<T>): Promise<R> => {
        const {
            url, 
            data, 
            config
        } = props

        const token = authToken()
        if(token){
            return axiosInstance.patch(url, {...data}, {
                ...privateConfig,  headers: {
                  ...privateConfig.headers, Authorization: 'Bearer ' + token
                }
            }).then(response => response.data)
        }

        return api.patch({url, data: {...data}})
    }, 
}
export {api}