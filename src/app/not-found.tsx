import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
      <p className="font-serif text-7xl font-semibold text-aqua">404</p>
      <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
        Page not found
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}