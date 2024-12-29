'use client'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {useParams, useRouter} from 'next/navigation'
import React from 'react'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'

const VerifyAccount = () =>{
    const router = useRouter()
    const params = useParams()
    const {toast} = useToast()

    const handleSignInRedirect = () => {
      router.push('/sign-in')
    }

    const form = useForm<z.infer<typeof verifySchema>>(
        {
          resolver : zodResolver(verifySchema),
        //   defaultValues : {
        //     username : '' ,
        //     email : '' ,
        //     password : '' 
        //   }
        }
      )

      const onSubmit = async(data : z.infer<typeof verifySchema>) =>{
        try {
            const response = await axios.post('/api/verify-code' , {
                username: params.username,
                code : data.code
            }) 
            console.log("PARAMS USERNAME RECIEVED IS  ----------------------------------------------------------------" , params.username)

            toast({
                title:"Success",
                description : response.data.message
            })
            router.replace('sign-in')
        } catch (error) {
            console.log("Otp Verification Failed" , error)
             const axiosError = error as AxiosError<ApiResponse>
             const errorMessage = axiosError.response?.data.message
             toast ({
                title : "OTP Verification Failed",
                description : errorMessage,
                variant : "destructive" 
            })


        }
      }
  return (
    <>
    <Navbar/>
        <div className="flex justify-center itens-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8">
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='w-full md:w-auto text-xl bg-blue-600 mx-36 border-white text-white rounded-xl border-2 hover:bg-blue-500'>Submit</Button>
      </form>
    </Form>

        <div className="text-center mt-8">
          <p>
            Please move directly to sign-in as sending an otp will require activation of paid serivces, currently it sends a mail only to me: {' '}
            <Button onClick={handleSignInRedirect} className='w-full md:w-auto text-xl bg-blue-600 mx-36 mt-8 border-white text-white rounded-xl border-2 hover:bg-blue-500'>
            Sign In
            </Button>
          </p>
        </div>

            </div>
        </div>
    </>
  )
}

export default VerifyAccount
