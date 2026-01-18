import {z} from 'zod'

export const usernamevalidation = z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20,"Username must not be greater than 20 characters")
    .regex(/^[a-zA-z0-9_]+$/,"Username must not contain special characters")


export const signUpSchema = z.object({
    username:usernamevalidation,
    // email:z.string().email({message:'invalid email address'}),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,{ message: "invalid email address" }),
    password:z.string().min(7,{message:"password must be at least 6 characters"})
})












// One-line summary: Defines validation rules for the username, email, and password fields for the sign-up form.

// Dependencies: Imports zod. This schema is used in the frontend sign-up page (sign-up/page.tsx) and the backend sign-up API route (api/sign-up/route.ts).


// Creates a reusable Zod schema for username validation. This is a great practice, as the same username rules are needed in multiple places. It chains multiple validation methods: .string() ensures the type is a string, .min() and .max() check the length, and .regex() checks for allowed characters

// Creates the main signUpSchema. z.object() defines a schema for an object. It combines the usernamevalidation with rules for the email and password.


