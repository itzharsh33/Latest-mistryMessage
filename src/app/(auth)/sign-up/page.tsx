"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z  from "zod"
import Link from "next/link"
import { useState,useEffect } from "react"
import { useDebounceValue,useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Button } from "@react-email/components"
import { Button } from "@/components/ui/button"
import {Loader2} from 'lucide-react'
// useRouter
const Page = () => {
  const [username, setusername] = useState('')
  const [usernameMessage, setusernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  

// there is definetly somethong problem with debounce 

  const debounced = useDebounceCallback(setusername,300)
 const router = useRouter()

 // zod implementation
  
 const form = useForm<z.infer<typeof signUpSchema>>({
  resolver: zodResolver(signUpSchema),
  defaultValues:{
    username:'',
    email:'',
    password:''
  }
 })

 useEffect(()=>{ 
  const checkUsernameUnique = async () =>{
    if(username){
      setisCheckingUsername(true)
      setusernameMessage('')
      try {
      const response = await axios.get(`/api/check-username-unique?username=${username}`)
    //   console.log(response.data.message)
      // let message = response.data.message
        const message = response.data.message
      setusernameMessage(message)
      } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setusernameMessage(
      axiosError.response?.data.message ?? "Error checking username"
      )
      } finally {
        setisCheckingUsername(false)
      }
    }
  }
  checkUsernameUnique()
 },[username])

 const onSubmit = async (data: z.infer<typeof signUpSchema>) =>{
   setisSubmitting(true)
   try {
    const response = await axios.post<ApiResponse>('/api/sign-up',data)
toast.success("Success", {
  description: response.data.message,

})
// router.replace(`/verify/${username}`)
router.replace(`/verify/${data.username}`)
setisSubmitting(false)
   } catch (error) {
    console.error("Error in sighup of user",error)
    const axiosError = error as AxiosError<ApiResponse>;
    // let errorMessage = axiosError.response?.data.message
    const errorMessage = axiosError.response?.data.message
toast.error("Sign-up failed", {
  description: errorMessage
})
setisSubmitting(false)
   }
 }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
         name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username"
                 {...field}
                 onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                 }}
                  />
                  
              </FormControl>
             {isCheckingUsername && <Loader2 className="animate-spin"/>}
             <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500':'text-red-500'}`}>test {usernameMessage}</p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
         name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email"
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
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? (
              <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin"/> Please wait
              </>
            ) : ("Sign Up") 
          }
        </Button>
        </form>
        </Form> 
         <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
        </div>
        </div>
  )
}

export default Page
























// let message = response.data.message
// const response = await axios.post<ApiResponse>('/api/sign-up', data)

// Here, data is automatically supplied by react-hook-form when the form is submitted.

// react-hook-form validates your form against the signUpSchema (via zodResolver) and then passes all field values as one object to your onSubmit function.

// So data looks like:

// {
//   username: "...",
//   email: "...",
//   password: "..."
// }



// What is debounce?

// Debouncing is a technique to control how often a function runs.
// Instead of executing a function immediately when triggered multiple times, debounce waits for a pause in calls, and only then runs it once.

// 👉 Imagine you type harsh in a search box:

// Without debounce: API request fires on every keystroke → 5 requests.

// With debounce(300ms): API waits until you stop typing for 300ms, then fires just 1 request.









// Breakdown:

// zodResolver — connects Zod validation to react-hook-form.

// useForm — main react-hook-form hook to manage form state.

// z — Zod library; used to define & infer schema types.

// Link — Next.js client navigation component.

// useState, useEffect — React hooks.

// useDebounceValue, useDebounceCallback — utilities for debouncing input changes.

// toast — UI notification library.

// useRouter — Next.js client navigation hook.

// signUpSchema — your Zod schema that defines the shape & validation of the form.

// axios + AxiosError — HTTP client & error type.

// ApiResponse — a custom TypeScript interface/type describing server response shape.

// Form, FormField, etc. — probably your UI wrappers (shadcn/radix-like).

// Input, Button, Loader2 — UI components.

// TypeScript concept: import axios, { AxiosError } from 'axios' — when you import AxiosError you're importing a type/class that describes the shape of errors Axios throws; you'll use that to tell TypeScript what kind of object error is in a catch.



// Each useState('') infers the state type from the initial value:

// username type is inferred as string.

// isCheckingUsername / isSubmitting inferred as boolean.

// setusername etc. are setter functions to update state.



// useDebounceCallback(setusername, 300) returns a debounced function that, when called with a value, will call setusername(value) after 300ms of inactivity.

// Example: debounced("alex") will run setusername("alex") after 300ms (if no new calls arrive).

// router is the Next.js navigation object used later for router.replace(...).


// useForm<z.infer<typeof signUpSchema>>() — Generics: here you're telling useForm what the TypeScript type of your form data is.

// z.infer<typeof signUpSchema> uses Zod to derive a TypeScript type from your Zod schema.

// This gives you type inference in the form: form.handleSubmit will pass an object of that exact shape to onSubmit.

// resolver: zodResolver(signUpSchema) wires Zod validation to React Hook Form so the form is validated using the schema automatically.

// defaultValues sets initial values for fields.



// What it does:

// Sets a loading flag isCheckingUsername.

// Calls /api/check-username-unique?username=... to query server.

// Extracts response.data.message and stores it in usernameMessage.

// On error, it casts error to AxiosError<ApiResponse> and pulls the server error message if present.

// Important lines:

// let message = response.data.message — response.data is the server response body. .message is a property you expect the backend to return (e.g., { message: "Username is unique" }).

// const axiosError = error as AxiosError<ApiResponse> — type assertion telling TS: "Trust me, error is an AxiosError shape." Safer alternatives exist (see below).


// data parameter: this is the validated form data passed by react-hook-form. Because you typed the form earlier (useForm<z.infer<typeof signUpSchema>>), data has the correct shape ({ username, email, password }).

// This answers your earlier question: data is declared implicitly as the parameter to onSubmit; it's provided by form.handleSubmit(onSubmit).

// axios.post<ApiResponse>('/api/sign-up', data) sends the form data to server. <ApiResponse> is a TypeScript generic telling Axios what shape to expect in response.data.

// toast.success displays success message based on response.data.message.

// Bug / important fix: router.replace(/verify/${username}) uses the local username state — but that may be stale because username is debounced. Use data.username instead — it's the actual submitted username and is always correct. So change to:



// Form {...form}: your Form wrapper receives all methods from useForm (register, control, etc.). Spreading form passes them down.

// form.handleSubmit(onSubmit) wraps onSubmit — it validates and gives data to onSubmit.

// FormField uses a render prop {({ field }) => ... }. The field object contains:

// value, onChange, onBlur, ref — the methods to wire the input to react-hook-form.

// Input {...field} connects the input to the form.

// You override onChange to call both:

// field.onChange(e) — update react-hook-form value immediately.

// debounced(e.target.value) — update the local username state after debounce.

// Spinner Loader2 shows when checking username.

// usernameMessage shows server feedback (unique / taken).















