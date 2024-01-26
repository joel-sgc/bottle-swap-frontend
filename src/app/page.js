'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

export default function Page() { 
  const socket = io('ws://localhost:4000');
  const [roomCode, setRoomCode] = useState('Loading...');
  const [nickname, setNickname] = useState('Anonymous');
  const [users, setUsers] = useState([]);
  const [uuid, setUUID] = useState('Loading...');
  console.log(users)


  socket.on('user-joined', ( data ) => {
    // Have to JSON.parse because socket.io doesn't support sending Maps
    let playerData = new Map(JSON.parse(data));

    // Set the users nicknames to the new Map
    setUsers(Array.from(playerData.values()));
  });

  socket.on('nickname-update', (newPlayerData) => {
    // Have to JSON.parse because socket.io doesn't support sending Maps
    let playerData = new Map(JSON.parse(newPlayerData));
    console.log(playerData)

    // Set the users nicknames to the new Map
    setUsers(Array.from(playerData.values()));
  })

  useEffect(() => {
    let uuid = uuidv4();
    // If we don't have a uuid in sessionStorage, set it
    // Otherwise, set the uuid state to the uuid in sessionStorage
    if (!sessionStorage.getItem('bottle-swap-uuid')) {
      sessionStorage.setItem('bottle-swap-uuid', uuid);
      setUUID(uuid)
    } else {
      setUUID(sessionStorage.getItem('bottle-swap-uuid'))
    }

    // When the user leaves the page, close the socket
    window.addEventListener('beforeunload', () => {
      socket.emit('console', 'closed')
      socket.close();
    });

    // Generate a new room code
    const generateRoom = async() => {
      setRoomCode(await socket.emitWithAck('get-new-code', uuid));
    }
    generateRoom();
  }, [])

  return (
    <main className='container h-screen flex items-center justify-center flex-col gap-8'>
      <section>
        <div className='flex gap-8 flex-col'>
          <h2>Client UUID: {uuid}</h2>
          <h2>Room Code: {roomCode}</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (uuid === 'Loading...' || roomCode === 'Loading...' || e.target.roomCode.value.trim().length !== 6) return;

            let code = e.target.roomCode.value;
            let newPlayers = await socket.emitWithAck('join-room', uuid, code, nickname);
            setUsers(Array.from(new Map(JSON.parse(newPlayers)).values()));
            
            e.target.reset();

            setRoomCode(roomCode);
          }} className='flex gap-2'>
            <Input type='text' name='roomCode' placeholder="Enter Room Code..."/>
            <Button type='submit'>Join Room</Button>
          </form>
          
          <hr/>

          <h2>Nickname: {nickname}</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (uuid === 'Loading...' || roomCode === 'Loading...' || e.target.nickname.value === '') return;

            socket.emit('set-nickname', uuid, e.target.nickname.value, roomCode);
            setNickname(e.target.nickname.value);
            e.target.reset();
          }} className='flex gap-2'>
            <Input type='text' name='nickname' placeholder="Enter Nickname..."/>
            <Button type='submit'>Set Nickname</Button>
          </form>

          <hr/>

          <h2>Users:</h2>
          <ul style={{paddingLeft: '40px'}}>
            {users.length > 0 ? (
              users.map((user, index) => (
                <li style={{listStyle: 'initial'}} key={index}>{user}</li>
              ))
              ) : (
              <li style={{listStyle: 'initial'}} key='Default'>Anonymous</li>
            )}
          </ul>

          <hr/>
          <Button onClick={async() => {
            if (uuid === 'Loading...' || roomCode === 'Loading...') return;
            setRoomCode(await socket.emitWithAck('get-new-code', uuid, roomCode));
            
            setUsers([]);
          }}>Disconnect</Button>
        </div>

      </section>

      <section className='flex'>
      </section>
    </main>
  );
}
