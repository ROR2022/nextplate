"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { console } from "inspector";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = await getLocale();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      `/${locale}/sign-up`,
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/${locale}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", `/${locale}/sign-up`, error.message);
  } else {
    return encodedRedirect(
      "success",
      `/${locale}/sign-up`,
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const locale = await getLocale();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", `/${locale}/sign-in`, error.message);
  }

  return redirect(`/${locale}/dashboard`);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();
  const locale = await getLocale();

  if (!email) {
    return encodedRedirect("error", `/${locale}/forgot-password`, "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/${locale}/auth/callback?redirect_to=/${locale}/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      `/${locale}/forgot-password`,
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    `/${locale}/forgot-password`,
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const locale = await getLocale();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      `/${locale}/protected/reset-password`,
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      `/${locale}/protected/reset-password`,
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      `/${locale}/protected/reset-password`,
      "Password update failed",
    );
  }

  return encodedRedirect("success", `/${locale}/protected/reset-password`, "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  const locale = await getLocale();
  await supabase.auth.signOut();
  return redirect(`/${locale}/sign-in`);
};

export const signInWithGoogleAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = await getLocale();
  
  const redirectTo = `${origin}/${locale}/auth/callback`;

  console.log('Redirect to:', redirectTo);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  
  if (error) {
    console.error("Error signing in with Google:", error);
    return encodedRedirect("error", `/${locale}/sign-in`, error.message);
  }
  
  // Redirigir al usuario a la URL proporcionada por Supabase
  console.log('Redirecting to data.url:', data.url);
  return redirect(data.url);
};

export const signInWithGithubAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = await getLocale();
  
  const redirectTo = `${origin}/${locale}/auth/callback`;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo,
    },
  });
  
  if (error) {
    console.error("Error signing in with GitHub:", error);
    return encodedRedirect("error", `/${locale}/sign-in`, error.message);
  }
  
  // Redirigir al usuario a la URL proporcionada por Supabase
  return redirect(data.url);
};
