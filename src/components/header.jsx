'use client';

import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/clerk-react";
import { SignedIn ,UserButton , SignInButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
const Header = () => {
  return (
    <div>
    <SignedIn>
      <UserButton afterSignOutUrl="/" />
      <Button> 
        <Link href="/draw" >Get Started</Link>
      </Button>
    </SignedIn> 
    <SignedOut>
      <SignInButton mode='modal' afterSignInUrl="/draw" >
        <Button>Get Started</Button>
      </SignInButton>
    </SignedOut>   
    
    </div>  
  )
}

export default Header