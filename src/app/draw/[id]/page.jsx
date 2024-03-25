"use client";
import Canvas from '@/components/canvas';
import { useUser } from '@clerk/nextjs';
import { useAuth } from "@clerk/nextjs";
export default function Page({ params }) {
    
    const roomId = ['5ecf15f9-4e66-4763-86eb-7e8e0e5e6076', 'll'];
    const isValidRoomId = roomId.includes(params.id.toString());


    return (
        <div>
            {isValidRoomId ? (
                <Canvas roomId={params.id} />
            ) : (
                <div>Invalid room ID</div>
            )}
        </div>
    );
}
