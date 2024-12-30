'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { TiMessages } from "react-icons/ti"

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className='shadow-sm h-32 lg:h-20 bg-blue-600 w-full center'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center p-4 text-white font-normal text-2xl'>
        <div className='flex flex-row gap-x-2'>
          <TiMessages className='mt-2' />
          <a className='text-xl lg:text-xxl font-bold md:mb-0' href="#">Mystery Msg</a>
        </div>
        {
          session ? (
            <>
              <span className='lg:ml-40 '>Welcome, {user.username || user.email}</span>
              <Button className='ml-80 md:w-auto lg:text-xl border-white rounded-xl border-2 hover:bg-blue-500' onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <div className='flex flex-row gap-x-4 mt-4'>
              <Link href='/sign-in'>
                <Button className='w-full md:w-auto text-xl border-white rounded-xl border-2 hover:bg-blue-500'>Login</Button>
              </Link>
              <Link href='/sign-up'>
                <Button className='w-full md:w-auto text-xl border-white rounded-xl border-2 hover:bg-blue-500'>SignUp</Button>
              </Link>
            </div>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar
