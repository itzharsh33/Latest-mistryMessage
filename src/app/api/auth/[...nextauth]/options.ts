
import { NextAuthOptions, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { JWT } from 'next-auth/jwt';

// We define a custom user type that includes the fields from your database model.
// This helps us avoid using 'any' and provides better type safety.
type CustomUser = User & {
  _id?: string;
  isVerified?: boolean;
  isAcceptingMessages?: boolean;
  username?: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // FIX: Replaced 'any' with specific types for credentials and the return value.
      async authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });

        //->  authorize runs when someone tries to sign in.

        // Connects to DB.

        // Finds a user by email OR username.

          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }

  
// -> If no user → throw error.

// If user exists but not verified → throw error.

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password || '',
            user.password
          );
          if (isPasswordCorrect) {
            // We return the full user object from the database.
            // It's cast to the base 'User' type to match the function's expected return type.
            return user as User;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: unknown) { // FIX: Replaced 'any' with 'unknown' for safer error handling.
          if (err instanceof Error) {
            throw new Error(err.message);
          } else {
            throw new Error('An unknown error occurred during authorization.');
          }
        }
      },
    }),
  ],

//->  Compare entered password with hashed password in DB.

// If correct → return user object.

// If wrong → throw error.

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        // The 'user' object here is what we returned from 'authorize'.
        // We cast it to our CustomUser type to safely access your database fields.
        const customUser = user as CustomUser;
        token._id = customUser._id?.toString();
        token.isVerified = customUser.isVerified;
        token.isAcceptingMessages = customUser.isAcceptingMessages;
        token.username = customUser.username;
      }
      return token;
    },

// -> jwt callback runs whenever a JWT is created/updated.

// If a user just logged in → put custom user data inside the token.

    // FIX: Replaced 'any' with the official 'Session' type from NextAuth.
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        // We transfer the custom properties from the token to the session user object.
        // Casting session.user to our custom type allows us to add the new fields.
        (session.user as CustomUser)._id = token._id as string;
        (session.user as CustomUser).isVerified = token.isVerified as boolean;
        (session.user as CustomUser).isAcceptingMessages = token.isAcceptingMessages as boolean;
        (session.user as CustomUser).username = token.username as string;
      }
      return session;
    },

// -> session callback runs whenever session is returned to client.

// Copy data from token → into session.user so frontend can access it.

  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};


// -> Use JWT for sessions (not database sessions).

// Secret is used to encrypt tokens.



// ✅ Summary:
// This file defines how NextAuth works:

// Provider: login with email/username + password.

// Authorize: check user in DB + bcrypt password check.

// Callbacks: store custom fields in JWT & session.

// Pages: custom login page.

// Session: use JWT strategy, secured by secret.


// 🧭 Why this two-step process (token → session)?

// Because:

// 🟡 Token = secure ID card stored in the cookie (used between server and browser)

// 🟢 Session = a simple object sent to your frontend when it asks “who am I?”

// By separating them:

// You keep the main data in the token (safe, signed, stored client-side).

// You control exactly what to show to the frontend in the session (avoid exposing sensitive stuff).


// this format can be obtained from nextauth - > credentials provider





