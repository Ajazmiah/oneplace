import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signup } from "./app/lib/actions/authentication/signupAction";
import { getUserByEmail } from "./app/lib/utils/databaseUtils";
import { AGE_COOKIE, verifyAgeToken } from "./app/lib/utils/ageVerification";
import { cookies } from "next/headers";

// Only trust an email the provider says the user has verified.
// All account lookups key on email, so an unverified one could reach someone else's data.
async function isEmailVerified({ user, account, profile }) {
  if (!user.email) return false;

  if (account.provider === "google") {
    return profile?.email_verified === true;
  }

  if (account.provider === "github") {
    const res = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${account.access_token}`,
        "User-Agent": "authjs",
      },
    });
    if (!res.ok) return false;

    const emails = await res.json();
    return emails.some(
      (e) => e.verified && e.email.toLowerCase() === user.email.toLowerCase()
    );
  }

  return false;
}

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
    async signIn({ user, account, profile }) {
      try {
        if (!(await isEmailVerified({ user, account, profile }))) {
          return "/signin?error=EmailNotVerified";
        }

        const existingUser = await getUserByEmail(user.email);

        if (!existingUser) {
          // New accounts require the signed 18+ cookie set on /confirm-age.
          // Without it, ask for the age; that page restarts this sign-in.
          const cookieStore = await cookies();
          if (!verifyAgeToken(cookieStore.get(AGE_COOKIE)?.value)) {
            return `/confirm-age?provider=${account.provider}`;
          }

          const authUser = {
            name: user.name,
            email: user.email,
          };
          await signup({ authUser });
          cookieStore.delete(AGE_COOKIE);
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
    }),
  ],
});
