'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormField , FormItem , FormLabel , FormControl , FormMessage} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'

function Page() {

  const [username , setUsername] = useState('')
  const [usernameMessage , setUsernameMessage] = useState('') // if the username exists or not
  const [isCheckingUsername , setisCheckingUsername] = useState(false) // to manage the loading state
  const [isSubmitting , setisSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername , 300)
  const {toast} = useToast()
  const router = useRouter()

  // XOD Implementation
  const form = useForm<z.infer<typeof signUpSchema>>(
    {
      resolver : zodResolver(signUpSchema),
      defaultValues : {
        username : '' ,
        email : '' ,
        password : '' 
      }
    }
  )

  useEffect(()=>{
    console.log("Username State" , username) ;
      const checkUsernameUnique = async ()=>{
        if(username){
          setisCheckingUsername(true)
          setUsernameMessage("")

          try {
            const response = await axios.get(`/api/check-username-unique?username=${username}`)
            console.log('Response received is ' , response)
            console.log("Response Message recieved  is " , response.data.message)
            setUsernameMessage(response.data.message)
          } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
          } finally{
            setisCheckingUsername(false)
          }
        }
      };
      checkUsernameUnique();
  } , [username]);

  const onSubmit = async(data : z.infer<typeof signUpSchema>) =>{
    setisSubmitting(true)
      try {
        const response = await axios.post<ApiResponse>('/api/sign-up' , data)
        toast({
          title:'Success',
          description : response.data.message
        })
        router.replace('/verify/${username}')
        setisSubmitting(false)
      } catch (error) {
        console.log("Error in Sign Up of User" , error)
        const axiosError = error as AxiosError<ApiResponse>
        const errorMessage = axiosError.response?.data.message
        toast ({
          title : "Signup failed",
          description : errorMessage,
          variant : "destructive" 
        })
        setisSubmitting(false)
        router.replace('/verify/${username}')
      } 
  }



  return (
    <>
      <Navbar/>
      <div className ="flex justify-center items-center min-h-screen bg-gray-100">
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className="text-center"> 
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery MSg
          </h1>
          <p className='mb-4'>Sign up to start your adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className = "space-y-6">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }} />
                
              </FormControl>
              {isCheckingUsername && <Loader2 className = "animate-spin" />}
              <p className={`test-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500'}`}> {username} {usernameMessage}</p>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}/>
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />


          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type = "password" placeholder="password" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <button type="submit" disabled = {isSubmitting} className=' bg-blue-600 bg-center cursor-pointer text-center rounded-xl px-4 py-2 hover:bg-blue-500'>SignUp
      </button>
          </form>
        </Form>
        <div className="text-center mt=4">
          <p>
            Already a member? {' '}
            <Link href = "sign-in" className='text-blue-600 hover:text-blue-800'>
            Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Page
