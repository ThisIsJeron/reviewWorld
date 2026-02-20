import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { SearchBar } from "@/components/layout/SearchBar";
import { MobileNav } from "@/components/layout/MobileNav";

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" className="text-xl font-bold text-orange-500 shrink-0">
          ReviewWorld
        </Link>

        <div className="hidden sm:flex flex-1">
          <SearchBar variant="header" />
        </div>

        <nav className="hidden sm:flex items-center gap-4 ml-4 shrink-0">
          <Link
            href="/brands"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Brands
          </Link>
          {session?.user ? (
            <UserMenu
              user={{
                id: session.user.id!,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
              }}
            />
          ) : (
            <SignInButton />
          )}
        </nav>

        <div className="sm:hidden ml-auto">
          <MobileNav session={session} />
        </div>
      </div>

      {/* Mobile search bar below header */}
      <div className="sm:hidden px-4 pb-3">
        <SearchBar variant="header" />
      </div>
    </header>
  );
}
