'use client';

import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/clerk-react";
import { SignedIn ,UserButton , SignInButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
    <SignedIn>
      <UserButton afterSignOutUrl="/" />
      <Button> 
        <Link href="/draw" >Get Started</Link>
      </Button>
    </SignedIn> 
    <SignedOut>
      <SignInButton afterSignInUrl="/" >
        <Button>Get Started</Button>
      </SignInButton>
    </SignedOut>   
    
    </div>
    
    
  );
}
