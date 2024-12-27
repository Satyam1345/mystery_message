'use client'
import React from 'react'
import Link from 'next/link'
import { useSession , signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'
import { TiMessages } from "react-icons/ti";

const Navbar = () => {

    const {data : session } = useSession()
    const user : User = session?.user 
  return (
    <nav className = 'shadow-sm h-20 bg-blue-600'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center p-4 text-white font-normal text-2xl'>
           <div className='flex flex-row gap-x-2'>
           <TiMessages className='mt-2'/>
           <a className = 'text-xxl font-bold mb-6 md:mb-0' href = "#">Mystery Msg</a>
           </div>
            {
                session ? (
                    <>
                        <span>Welcome , {user.username || user.email}</span>
                        <Button className='w-full md:w-auto' onClick={ ()=>signOut() }>Logout</Button>
                    </>
                ) : (
                    <Link href = '/sign-in'>
                        <Button className='w-full md:w-auto text-xl border-white rounded-xl border-2 hover:bg-blue-500'>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar
