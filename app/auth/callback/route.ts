import { NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // Extract auth code and optional redirect path
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // Exchange the auth code for a session
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (data?.user) {
      const { id, email } = data.user;
      const { full_name, name } = data.user.user_metadata;
      const fullName = full_name || name || "No name found";

      console.log("--------------------------------------------------");
      console.log("User Logged In Successfully:");
      console.log(`User ID:   ${id}`);
      console.log(`Email:     ${email}`);
      console.log(`Full Name: ${fullName}`);
      console.log("--------------------------------------------------");

      const { error: upsertError } = await supabase.from("users").upsert({
        id: id,
        name: fullName,
        email: email!,
      });

      if (upsertError) {
        console.error("Error creating/updating user:", upsertError);
      }
    }

    if (!error) {
      // Redirect to the intended path or fallback to homepage
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Redirect to error page if code is missing or exchange fails
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
