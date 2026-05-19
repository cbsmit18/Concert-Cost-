/** Plain-English messages for Supabase auth errors */

export function getAuthErrorMessage(message: string): string {

  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {

    return "Wrong email or password. Please try again.";

  }

  if (lower.includes("user already registered") || lower.includes("already registered")) {

    return "That email is already registered. Try logging in instead.";

  }

  if (lower.includes("password") && lower.includes("short")) {

    return "Password must be at least 6 characters.";

  }

  if (lower.includes("email not confirmed")) {

    return "Please confirm your email before logging in. Check your inbox.";

  }

  if (lower.includes("rate limit")) {

    return "Too many attempts. Please wait a moment and try again.";

  }

  return message;

}

