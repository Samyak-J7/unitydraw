"use client"
import Header from "@/components/header";
import { LampContainer } from "@/components/ui/lamp";
import React from "react";
import { motion } from "framer-motion";


export default function Home() {
  return (
    <div className=" bg-slate-200">
      <Header />
      <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 150 }}
        whileInView={{ opacity: 1, y: 90 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className=" bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build <span className="font-bold text-slate-300">Canvas</span>  <br /> the right way.<br/>
        <span className="text-xl text-slate-400 "> The canvas that grows with your imagination.</span> <br/> 
        <span className="text-2xl text-slate-300 "> Click. Create. Collaborate.</span>   <br/>
         
      </motion.h1>     
    </LampContainer>
   
    
    </div>
  );
}
