import useAuthContext from "@contexts/AuthContext/useAuthContext"
import type { BaseSyntheticEvent } from "react"
import { UseFormReset } from "react-hook-form"
import { AuthForm } from "./AuthModal"


type AuthModalFormProps = React.PropsWithChildren<{
  onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>
  reset: UseFormReset<AuthForm>
}>

const AuthModalForm: React.FC<AuthModalFormProps> = ({ children, onSubmit, reset }) => {
  const setAuthMode = useAuthContext((state) => state.setAuthMode)
  const startOAuth = useAuthContext((state) => state.startOAuth)
  const authMode = useAuthContext((state) => state.authMode)


  return <>
    <h1 className='text-3xl font-bold mb-8'>{authMode === "login" ? "LOG IN" : (authMode === "register" ? "SIGN UP": "PASSWORD")}</h1>
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {children}
    </form>

    <div className='relative w-full mb-4 py-5 mt-4'>
      <div className='w-full h-1 bg-gray-200'></div>
      <p className='absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-10 inline-block px-2 bg-white text-gray-500 border border-gray-200'>OR</p>
    </div>

    <div className='flex gap-3 mb-4'>
      <button className='w-12 h-12 rounded-full bg-42logo bg-cover hover:bg-gray-300' onClick={() => startOAuth('42')} />
      <button className='w-12 h-12 rounded-full bg-googlelogo bg-cover hover:bg-gray-300' />
    </div>

    <div className='text-center flex gap-1 max-:flex-col'>
      <p className='text-gray-500'>{
        authMode === "login"
          ? "Need an account?"
          : "Already a user?"
      }</p>
      <a className='text-indigo-500 hover:underline cursor-pointer' onClick={() => {
        reset()
        setAuthMode(authMode === 'login' ? 'register' : 'login')
      }}>{
          authMode === "login"
            ? "SIGN UP"
            : "LOG IN"
        }</a>
    </div>

    {authMode !== "forgotPassword" && <div className="text-center flex gap-1 max-:flex-col">
      <p className='text-gray-500'>Password forgotten ?</p>
      <a className="text-indigo-500 hover:underline cursor-pointer" onClick={() => {
        reset()
        setAuthMode('forgotPassword')
      }}>RESET</a>
    </div>}
  </>
}

export default AuthModalForm