'use client';

import useAuthContext from '@contexts/AuthContext/useAuthContext';
import Container from '@mui/material/Container';
import React, { useEffect } from 'react'

const LoginClient: React.FC = () => {

  const startAuth = useAuthContext((state) => state.startAuth)

  useEffect(() => {
    startAuth('login')
  }, [])

  return (
    <Container className='flex gap-4 items-center justify-center flex-col h-screen w-screen bg-gray-900'>
      <div className='flex items-center justify-center gap-6 text-white text-lg'>
      </div>
    </Container>
  )
}

export default LoginClient
