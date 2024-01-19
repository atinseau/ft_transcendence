import useServerStore from "@hooks/useServerStore"
import LoginClient from "./LoginClient"
import { redirect } from "next/navigation"


const Login: React.FC = () => {

  const { session } = useServerStore()

  if (session) {
    redirect('/')
  }

  return <LoginClient />
}

export default Login
