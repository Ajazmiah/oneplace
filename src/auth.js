import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signup } from "./app/actions/signupAction";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { connectDb } from "./database/dbConnection";
import { use } from "react";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      return "/dashboard/applications";
    },
    // This callback is called whenever a new JWT is created (on sign-in)
    // and on every subsequent request where the session is accessed.
    // async jwt({ token, user }) {
    //   if (user) {
    //     console.log("USER_JWT", user);
    //     token.id = user.id;
    //   }

    //   return token;
    // },
    // This callback is called on every request where the session is accessed
    // (e.g., using `auth()` or `useSession()`).
    // async session({ session, token }) {
    //   if (token) {
    //     session.user._id = token.id;
    //   }
    //   return session;
    // },
    async signIn({ user, account, profile, email }) {
      console.log("USER____", user);
      try {
        const authUser = {
          name: user.name,
          email: user.email,
        };

        await signup({ authUser });

        return true;
      } catch (e) {
        console.log("AUTH_LOGIN_ERROR", e);
        return false;
      }
    },
  },
  trustHost: true,

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true 
    }),
  ],
});
