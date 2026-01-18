import 'next-auth'

declare module 'next-auth'{
    interface User{
    _id?:string;
    isVerified?:boolean;
    isAcceptingMessages?: boolean;
    username?:string
    }
    interface Session{
        user:{
    _id?:string;
    isVerified?:boolean;
    isAcceptingMessages?: boolean;
    username?:string
        } & DefaultSession['user']
  
    }
   
}

declare module 'next-auth'{
    interface JWT{
    _id?:string;
    isVerified?:boolean;
    isAcceptingMessages?: boolean;
    username?:string
    }
}








// Why this file is needed

// By default, TypeScript only knows NextAuth’s built-in fields.
// If you add custom fields in your database (username, _id, etc.), TS will complain unless you tell it.
// This file updates NextAuth’s types so your whole project stays type-safe.


// interface Session { user: ... }

// A Session in NextAuth is what you access on the client side via useSession().
// By default, session.user only has { name, email, image }.
// Here you merge in your custom fields.
// & DefaultSession['user'] means:
// “Keep the default NextAuth fields (name, email, image) AND add mine.”
// So now session.user has both the defaults and your custom MongoDB fields


// JWT here is the JSON Web Token NextAuth creates.
// When using JWT strategy, NextAuth stores the user’s info inside the JWT.
// You extend it so your token also carries _id, isVerified, etc.



// Together:

// Zod: Filters bad input early → good UX, fast feedback.

// Mongoose: Last line of defense → ensures DB stays clean.