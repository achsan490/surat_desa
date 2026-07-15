"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAdminAction(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      username,
      password,
      redirectTo: "/admin/dashboard",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      // Handle credentials sign in error
      return { success: false, error: "Username atau password salah. Silakan coba lagi." };
    }
    // We must rethrow the Next.js redirect error so the framework handles the redirection
    throw error;
  }
}
