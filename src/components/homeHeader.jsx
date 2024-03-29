import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import {useRouter} from 'next/navigation'

const HomeHeader = (props) => {
    const router = useRouter();
  return (
    <nav className='flex justify-between items-center p-4 px-8 bg-black border-gray-500 border-b-2 mb-2' >
        <div className='flex justify-between items-center gap-4' >
            <UserButton />
            <p><span className='text-slate-200'>Hi ,</span> <span className='font-semibold font-sans text-white text-xl'> {props.username} </span></p>
        </div>
        <a href="/" > Unity Draw </a>
        <Button className="bg-black hover:bg-zinc-900 hover:border-white  border-2 border-gray-400" onClick={()=>router.push("/draw")} >
            <Plus size={24} />
            New Canvas
        </Button>
        
    </nav>
  )
}

export default HomeHeader