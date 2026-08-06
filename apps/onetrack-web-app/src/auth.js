import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signup } from "./app/lib/actions/authentication/signupAction";
import { getUserByEmail } from "./app/lib/utils/databaseUtils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  logger: {
    error(error) {
      console.error("AUTH_ERROR", error.name, error.message, error);
    },
    warn(code) {
      console.warn("AUTH_WARN", code);
    },
  },

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
        if (!process.env.NEXTAUTH_URL) {
          console.error("AUTH_LOGIN_ERROR: NEXTAUTH_URL env var is not set");
        }

        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/user?email=${encodeURIComponent(
            user.email
          )}`
        );

        if (!res.ok) {
          const authUser = {
            name: user.name,
            email: user.email,
          };
          await signup({ authUser });
        }

        return true;
      } catch (e) {
        console.error("AUTH_LOGIN_ERROR", e.name, e.message, e.stack);
        return false;
      }
    },

    async jwt({ token, user, profile }) {
      // On initial sign-in, persist the profile image into the token
      if (profile) {
        token.picture = profile.picture || profile.avatar_url || token.picture;
      }
      return token;
    },

    async session({ session, token }) {
      // Forward the image from the JWT token to the session on every request
      if (token.picture) {
        session.user.image = token.picture;
      }
      return session;
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
      allowDangerousEmailAccountLinking: true,

      authorization: {
        params: {
          prompt: "consent",
        },
       //"online" (default) → you only get an access token
      // "offline" → you also get a refresh token
      },
    }),
  ],
});
