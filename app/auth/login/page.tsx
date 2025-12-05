"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import createClient from "@/lib/supabase/client";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isAppleLoading, setIsAppleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({

        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""
            }`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setError("There was an error logging in with Google. Please try again.");
      console.error("Error loging in with Google:", error);
      setIsGoogleLoading(false);
    }
  };

  const loginWithApple = async () => {
    setIsAppleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""
            }`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error logging in with Apple:", error);
      if (
        error.message?.includes("Unsupported provider") ||
        error.msg?.includes("Unsupported provider") ||
        error.code === "validation_failed"
      ) {
        setError(
          "Apple Login is not enabled in Supabase. Please configure it in the dashboard."
        );
      } else {
        setError("There was an error logging in with Apple. Please try again.");
      }
      setIsAppleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">
          Login to your account to continue
        </p>
      </div>

      {error && (
        <div className="rounded-md border px-4 py-3">
          <p className="text-sm">
            <CircleAlert
              className="me-3 -mt-0.5 inline-flex text-red-500"
              size={16}
              aria-hidden="true"
            />
            {error}
          </p>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={loginWithGoogle}
        disabled={isGoogleLoading || isAppleLoading}
      >
        {isGoogleLoading ? (
          <LoaderCircle className="animate-spin size-5" />
        ) : (
          <GoogleIcon />
        )}
        <span className="ml-2">Login with Google</span>
      </Button>

      <Button
        variant="outline"
        className="w-full mt-2"
        onClick={loginWithApple}
        disabled={isAppleLoading || isGoogleLoading}
      >
        {isAppleLoading ? (
          <LoaderCircle className="animate-spin size-5" />
        ) : (
          <AppleIcon />
        )}
        <span className="ml-2">Login with Apple</span>
      </Button>
    </div>
  );
}

const GoogleIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="size-5"
  >
    <path
      fill="#fbc02d"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#e53935"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4caf50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1565c0"
      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="size-5"
    fill="currentColor"
  >
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);
