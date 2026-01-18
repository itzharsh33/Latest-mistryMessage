"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z  from "zod"
import Link from "next/link"
import { useState,useEffect } from "react"
import { useDebounceValue,useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Button } from "@react-email/components"
import { Button } from "@/components/ui/button"
import {Loader2} from 'lucide-react'
import { signIn } from "next-auth/react"
useRouter
const Page = () => {


  

// there is definetly somethong problem with debounce 

  
 const router = useRouter()

 // zod implementation
  
 const form = useForm<z.infer<typeof signInSchema>>({
  resolver: zodResolver(signInSchema),
  defaultValues:{
    identifier:'',
    password:''
  }
 })



 const onSubmit = async (data: z.infer<typeof signInSchema>) =>{
const result =    await signIn('credentials',{
    redirect:false,
    identifier:data.identifier,
    password:data.password
  })
// commented but used by sir

// if(result?.error){
//   if(result.error == 'CredentialsSignin'){
// toast.error("Sign-up failed", {
//   description: "Incorrect username or password"
// })
//   }
// }else{
// toast.error("Error", {
//   description: "Incorrect username or password"
// })
// }

//  if(result?.url){
//   router.replace('/dashboard')
//  }

if (result?.error) {
  toast.error("Login failed", {
    // description: "Incorrect username or password",
    description: result.error,
  });
} else {
  toast.success("Welcome back!");
  router.replace("/dashboard");
}

 }



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
             Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField
         name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="email/username"
                 {...field}
                  />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
         name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password"
                 {...field}
                  />
              </FormControl>
             
              <FormMessage />
            </FormItem> 
          )}
        />
        <Button type="submit" >
       Sign In
        </Button>
        </form>
        </Form> 
         <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
        </div>
        </div>
  )
}

export default Page
























// const form = useForm<z.infer<typeof signInSchema>>({
//   resolver: zodResolver(signInSchema),
//   defaultValues:{
//     identifier:'',
//     password:''
//   }
// })


// -> useForm(...) creates form state/handlers.

// zodResolver(signInSchema) connects Zod schema validation to react-hook-form validation.

// defaultValues sets initial values for form fields.


// const onSubmit = async (data: z.infer<typeof signInSchema>) =>{
//   const result = await signIn('credentials',{
//     redirect:false,
//     identifier:data.identifier,
//     password:data.password
//   })
//   ...
// }

// -> onSubmit is called by form.handleSubmit(onSubmit) when the user submits and validation passes.

// data is the validated form data (typed via z.infer).

// signIn('credentials', {...}) calls NextAuth’s credentials provider:

// redirect: false prevents NextAuth from doing an automatic browser redirect — instead it returns a result object.

// The remaining fields (identifier, password) are passed to your credentials provider backend code.

// What signIn returns:
// When redirect:false, signIn resolves to an object like:

// {
//   error?: string,    // error message or error code
//   ok?: boolean,      // true on success
//   status?: number,
//   url?: string | null // redirect url if any
// }


// if (result?.error) {
//   toast.error("Login failed", {
//     // description: "Incorrect username or password",
//     description: result.error,
//   });
// } else {
//   toast.success("Welcome back!");
//   router.replace("/dashboard");
// }

// -> If result?.error exists, a toast shows the error message.

// Otherwise, show a success toast and navigate to /dashboard.


// FormField binds the UI input to react-hook-form via the field prop. field includes value, onChange, onBlur, ref.

// Input {...field} wires the input to the form — changes update the form state.