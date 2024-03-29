"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, UserButton, SignInButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
const Header = () => {
  const router = useRouter();
  return (
    <nav className="flex h-[10vh] justify-between items-center p-4 bg-slate-950 border-b border-slate-900 shadow-2xl ">
      <p className="text-white">UNITYDRAW</p>
      <SignedIn>
        <HoverBorderGradient
          containerClassName="rounded-xl"
          as="button"
          className=" bg-slate-950 text-white flex items-center space-x-2"
          onClick={() => {
            router.push("/draw");
          }}
        >
          Get Started
        </HoverBorderGradient>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" afterSignInUrl="/draw">
          <HoverBorderGradient
            containerClassName="rounded-xl"
            as="button"
            className=" bg-slate-950 text-white flex items-center space-x-2"
            onClick={() => {
              router.push("/draw");
            }}
          >
            Get Started
          </HoverBorderGradient>
        </SignInButton>
      </SignedOut>
    </nav>
  );
};

export default Header;
