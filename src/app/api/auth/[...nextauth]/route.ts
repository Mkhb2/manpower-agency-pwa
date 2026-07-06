import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrMobile: { label: "Email or Mobile", type: "text", placeholder: "john@example.com / +1234567890" },
        password: { label: "Password (or OTP)", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.emailOrMobile || !credentials?.password) {
          return null;
        }

        // Check if user exists by email or mobile
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.emailOrMobile },
              { mobile: credentials.emailOrMobile }
            ]
          }
        });

        if (!user) {
          // If no user found, you'd typically return null.
          // For OTP flow, if password is correct OTP, create user or login.
          return null;
        }

        // Real app: verify passwordHash or OTP here.
        // For demonstration, we assume valid if user is found.
        
        return {
          id: user.id,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Custom login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
