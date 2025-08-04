// app/signup/actions.ts
"use server";

import { connectDb } from "@/database/dbConnection";
import userModel from "../../database/models/userModel";

export async function signup({ name, email, password, authUser = null } = {}) {
  await connectDb();

  // The logic for manual signup (without authUser) would go here.
  // This part is commented out for clarity based on your code, but you should
  // add it if you have a manual signup form.
  /*
  if (!authUser) {
    if (!name || !email || !password) {
      return { error: "All fields are required" };
    }
  }
  */

  // Determine the email and ID to search for based on the sign-in type
  const searchEmail = authUser?.email || email;
  const searchId = authUser?.id; // Assuming the ID from Auth.js is 'id'

  const existingUser = await userModel.findOne({
    // We can search by either email or the provided ID
    $or: [{ email: searchEmail }, { _id: searchId }],
  });

  if (existingUser) {
    console.log("User already exists, returning existing user data.");
    // --- THIS IS THE KEY CHANGE YOU REQUESTED ---
    // Instead of returning an error, we return the existing user data.
    return { success: true, user: existingUser };
  }

  // If the user does not exist, we create a new one based on the sign-in method
  try {
    let newUser;

    if (authUser) {
      // Create user for AuthO sign-in
      newUser = await userModel.create({
        _id: authUser.id, // Use the ID from Auth.js user object as the _id
        fullname: authUser.name,
        email: authUser.email,
        // You would not store a password here
      });
    } else {
      // Create user for manual sign-up
      // This is a placeholder; you would need to add your password hashing logic
      // newUser = await userModel.create({
      //   fullname: name,
      //   email: email,
      //   password: password,
      // });
    }

    console.log("FROM ACTION USER :", newUser);
    return { success: true, user: newUser };
  } catch (e) {
    console.error("Error creating new user:", e);
    return { error: "An error occurred during user creation." };
  }
}
