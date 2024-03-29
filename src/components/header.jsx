"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, UserButton, SignInButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";
const Header = () => {
  return (
    <nav >
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        <Button>
          <Link href="/home">Get Started</Link>
        </Button>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" afterSignInUrl="/draw">
          <Button>Get Started</Button>
        </SignInButton>
      </SignedOut>
    </nav>
  );
};

export default Header;
