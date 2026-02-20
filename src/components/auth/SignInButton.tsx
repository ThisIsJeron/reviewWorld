"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  callbackUrl?: string;
}

export function SignInButton({ callbackUrl = "/" }: SignInButtonProps) {
  return (
    <Button
      onClick={() => signIn("google", { callbackUrl })}
      variant="default"
    >
      Sign in with Google
    </Button>
  );
}
