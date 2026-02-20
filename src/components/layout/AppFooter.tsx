import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t bg-muted/30 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-orange-500">ReviewWorld</p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/brands" className="hover:text-foreground transition-colors">Brands</Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ReviewWorld. Community reviews for food products.
          </p>
        </div>
      </div>
    </footer>
  );
}
