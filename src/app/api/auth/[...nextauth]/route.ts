import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}




// This file basically says:

// “Hey Next.js, whenever someone hits /api/auth/*, use NextAuth with my custom authOptions to handle all login, logout, session, and callback stuff.”

// It’s like the bridge between NextAuth’s internal logic and your custom config.