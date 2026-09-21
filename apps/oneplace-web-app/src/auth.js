import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signup } from "./app/lib/actions/authentication/signupAction";
import { getUserByEmail } from "./app/lib/utils/databaseUtils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: process.env.NODE_ENV === "development",
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

  session: {
    maxAge: 15 * 24 * 60 * 60, // 15 days
    updateAge: 24 * 60 * 60, // refresh the session once per day of activity
  },

  callbacks: {
    async signIn({ user }) {
      try {
        const existingUser = await getUserByEmail(user.email);

        if (!existingUser) {
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
    }),
  ],
});
