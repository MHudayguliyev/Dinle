import { useEffect } from "react"
import { useRouter } from "next/navigation"
import authToken from "@api/Services/auth_token"
import moment from "moment"
import { getFromStorage } from "@app/_utils/storage"
import { parse } from "@app/_utils/helpers"


function AuthMiddleware (WrappedComponent:any){
  return (props: any) => {
    const router = useRouter()
    useEffect(() => {
      const user = parse(getFromStorage('authUser')!)
      if(user){
        const expiresAt = user?.expiresAt
        const now = moment(new Date())
        console.log("expiresAt", expiresAt)
        console.log("now", now)
        const duration = moment.duration(now.diff(expiresAt))
        console.log("duration", duration)
        const hours = duration.asHours()
        console.log("hours", hours)
        // if()
        // router?.push('/login')
      }else return router?.push('/login') 
    }, [])

    const tom = moment(new Date()).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
    console.log(tom)
    return <WrappedComponent {...props}/>
  }
}

export default AuthMiddleware