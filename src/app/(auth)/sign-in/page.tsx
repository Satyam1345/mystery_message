'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize the form with the corrected schema
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.username,
        password: data.password
      })

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error === 'CredentialsSignin' ? "Incorrect Username or Password" : result.error,
          variant: "destructive"
        })
      } else if (result?.url) {
        router.replace(result.url)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">
            Sign In to Mystery Msg
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-700 text-white rounded-xl px-4 py-2"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignInPage
