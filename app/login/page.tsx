import { Box } from '@mantine/core'
import React from 'react'
import LoginPage from './LoginForm'
import { getAuth } from '@/lib/auth/dal'
import { redirect } from 'next/navigation'

const page = async () => {
  // const {user} = await getAuth();
  // if (user) {
  //   redirect('/dashboard');
  // }

  return (
    <LoginPage />
  )
}

export default page