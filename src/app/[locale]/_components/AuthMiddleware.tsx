import { useEffect } from "react"
import { useRouter } from "next/navigation"
import moment from "moment"
import { getFromStorage } from "@app/_utils/storage"
import { parse } from "@app/_utils/helpers"
import { refreshAccessToken } from "@app/_api/Services/auth_token"


function AuthMiddleware (WrappedComponent:any){
  return (props: any) => {
    const router = useRouter()
    useEffect(() => {
      const user = parse(getFromStorage('authUser')!)
      if(user){
        const expiresAt = user?.expiresAt
        const now = moment(new Date())
        if(expiresAt){
          if(now.isSameOrAfter(expiresAt)){
            refreshAccessToken().then(isError => {
              if(isError) router.replace('/login')
              else window.location.reload()
            })
          }
        }else router.replace('/login')
      }else router.replace('/login') 
    }, [])
    return <WrappedComponent {...props}/>
  }
}

export default AuthMiddleware