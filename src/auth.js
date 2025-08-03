import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signup } from "./app/actions/signupAction";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      return "/dashboard/applications";
    },
    async signIn({ user, account, profile, email }) {
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
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
});
