// app/auth/page.tsx (Next.js 14+ with App Router)
"use client";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import Link from "next/link";

export default function AuthPage() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);
  const providerIcons = {
    Google: <FcGoogle className="w-6 h-6" />,
    GitHub: <FaGithub className="w-6 h-6" />,
  };

  if (providers) console.log(providers);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full p-8 shadow-xl rounded-2xl border border-gray-100">
        <form
          method="post"
          action="/api/auth/callback/credentials"
          className="space-y-4"
        >
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0bbcaa]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0bbcaa]"
          />
          <button
            type="submit"
            className="w-full bg-main text-white py-3 rounded-lg font-semibold hover:bg-opacity-90"
          >
            Sign in with Credentials
          </button>
        </form>

        <div className="my-6 border-t text-center relative">
          <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-gray-500">
            OR
          </span>
        </div>

        <div className="space-y-3">
          {providers &&
            Object.values(providers).map((provider) => {
              if (provider.id === "credentials") return null;
              return (
                <div key={provider.name}>
                  <button
                    onClick={() => signIn(provider.id)}
                    className="flex justify-center items-center gap-1.5 w-full py-3 border rounded-lg hover:bg-gray-50 font-medium cursor-pointer"
                  >
                    {providerIcons[provider.name]} Sign in with {provider.name}
                  </button>
                </div>
              );
            })}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-gray-700 hover:text-black font-medium underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
