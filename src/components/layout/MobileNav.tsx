"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface MobileNavProps {
  session: Session | null;
}

export function MobileNav({ session }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-orange-500">ReviewWorld</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-orange-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/brands"
            onClick={() => setOpen(false)}
            className="text-lg font-medium hover:text-orange-500 transition-colors"
          >
            Brands
          </Link>
          {session?.user ? (
            <>
              <Link
                href={`/profile/${session.user.id}`}
                onClick={() => setOpen(false)}
                className="text-lg font-medium hover:text-orange-500 transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="text-lg font-medium hover:text-orange-500 transition-colors"
              >
                Account Settings
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setOpen(false);
                signIn("google");
              }}
            >
              Sign In with Google
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
