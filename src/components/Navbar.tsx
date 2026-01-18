"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { link } from 'fs'
import { useRouter } from 'next/navigation'
const Navbar = () => {
    const {data:session} = useSession()
    const user:User = session?.user
    const router = useRouter()
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
      <Link href="/" className="text-3xl font-bold mb-4 md:mb-0">Mystry Message</Link>
      {
        session ? (
          <>
          <span className="mr-4 text-2xl">Welcome, {user?.username || user?.email}</span>
          <div className=' flex gap-x-4'>
             <Link href='/about'>
            <button className="w-full p-2 rounded-sm  md:w-auto bg-slate-100 text-black cursor-pointer" >About Us</button>
          </Link>
          <Link href='/dashboard'>
            <button className="w-full p-2 rounded-sm  md:w-auto bg-slate-100 text-black cursor-pointer" >Dashboard</button>
          </Link>
          
          {/* <button onClick={()=> signOut()} className="w-full p-2 rounded-sm  md:w-auto bg-slate-100 text-black cursor-pointer" >Logout</button> */}
            <button 
                  onClick={async () => {
                    await signOut({ redirect: false })
                    router.push('/')
                  }} 
                  className="p-2 rounded-sm bg-slate-100 text-black cursor-pointer"
                >
                  Logout
                </button>
          </div>
          
          </>
        ):(
          
          <div className='flex gap-x-6'>
           <Link href='/about'>
            <button className="w-full p-2 rounded-sm  md:w-auto bg-slate-100 text-black cursor-pointer" >About Us</button>
          </Link>
          <Link href='/sign-in'>
            <button className="w-full p-2 rounded-sm  md:w-auto bg-slate-100 text-black cursor-pointer" >Login</button>
          </Link>
        
          </div>
          
        )
      }
    </div>
    </nav>
  )
}

export default Navbar


















// useSession() returns an object like:

// {
//   data: Session | null,
//   status: "loading" | "authenticated" | "unauthenticated"
// }


// By writing { data: session }, you are extracting only the data property and renaming it to session.

// After this line, session directly holds the session object (or null if not logged in), which is convenient:

// console.log(session?.user) // directly access user





// If you write:
// // as i thought 
// const session = useSession()


// Now session holds the whole object returned by useSession(), not just the data:

// {
//   data: Session | null,
//   status: "loading" | "authenticated" | "unauthenticated"
// }


// To get the actual user/session, you’d need to access session.data:

// console.log(session.data?.user) // access user
// console.log(session.status)     // check loading/auth status

// which is not convenient as here we require only data which holds session is present or not and not status property of useSession()