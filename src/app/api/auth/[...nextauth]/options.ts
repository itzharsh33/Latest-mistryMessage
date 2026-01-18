
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
      
      async authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });

       

          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }

  


          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password || '',
            user.password
          );
          if (isPasswordCorrect) {
          
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


  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
   
        const customUser = user as CustomUser;
        token._id = customUser._id?.toString();
        token.isVerified = customUser.isVerified;
        token.isAcceptingMessages = customUser.isAcceptingMessages;
        token.username = customUser.username;
      }
      return token;
    },


    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
   
        (session.user as CustomUser)._id = token._id as string;
        (session.user as CustomUser).isVerified = token.isVerified as boolean;
        (session.user as CustomUser).isAcceptingMessages = token.isAcceptingMessages as boolean;
        (session.user as CustomUser).username = token.username as string;
      }
      return session;
    },



  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};


