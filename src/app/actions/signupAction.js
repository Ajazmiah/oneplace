// app/signup/actions.ts
"use server";

// import bcrypt from "bcryptjs";
// import { db } from "@/lib/db"; // or your DB instance
// import { redirect } from "next/navigation";
// import { use } from "react";

export async function signup({ name, email, password }) {
  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  //   const existingUser = await db.user.findUnique({ where: { email } });

  //   if (existingUser) {
  //     return { error: "User already exists with this email" };
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   await db.user.create({
  //     data: {
  //       name,
  //       email,
  //       password: hashedPassword,
  //     },
  //   });

  const user = {
    name,
    email,
  };

  return { success: true , user };
}
