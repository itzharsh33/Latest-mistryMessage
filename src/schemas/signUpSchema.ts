import {z} from 'zod'

export const usernamevalidation = z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20,"Username must not be greater than 20 characters")
    .regex(/^[a-zA-z0-9_]+$/,"Username must not contain special characters")


export const signUpSchema = z.object({
    username:usernamevalidation,
    
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,{ message: "invalid email address" }),
    password:z.string().min(7,{message:"password must be at least 6 characters"})
})










