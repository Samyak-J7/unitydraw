"use client";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';
const socket = io("http://localhost:4001");

function Room() {
    const router = useRouter();
    const [roomId, setRoomId] = useState(null);
    const [roomCreated, setRoomCreated] = useState(false);
    const [userid , setUserId] = useState("samyak");
    useEffect(() => {
        socket.on('roomCreated', (newRoomId) => {
            setRoomId(newRoomId);
            setRoomCreated(true);
        });
    }, []);

    const handleCreateRoom = () => {
        socket.emit('createRoom', userid);
    };

    const handleJoinRoom = (roomId) => {
        socket.emit('joinRoom', roomId,userid);
    };
    useEffect(() => {
        if(roomCreated){
        console.log(roomId)
        router.push(`/room/${roomId}`);}
    }, [roomCreated]);

    // (Your component rendering logic based on roomId and roomCreated states)

    return (
        <div>
            <p>User id: {userid}</p>

            {!roomId && !roomCreated && (
                <button onClick={handleCreateRoom}>Create Room</button>
            )}
            {roomId && !roomCreated && (
                <p>Creating room...</p>
            )}
            {roomCreated && (
              
                    <p>Your room ID: {roomId}</p>
            )}

            <button onClick={() => handleJoinRoom(roomId)}>Join Room</button>
        </div>
    );
}
export default Room;
