import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
        404
      </h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        It might have been moved or deleted.
      </p>
      <Link href="/" passHref>
        <Button className="mt-6">Go back home</Button>
      </Link>
    </div>
  );
}
