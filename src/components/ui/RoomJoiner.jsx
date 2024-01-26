'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const RoomJoiner = ({ socket }) => {
  const joinRoom = async (roomCode) => {
    socket.emit('join-room', roomCode);
    const room = await socket.emitWithAck('get-users', roomCode);
    console.log(room)
  }

  return (
    <form action={joinRoom} className='flex gap-2'>
      <Input type='text' name='roomCode' />
      <Button type='submit'>Join Room</Button>
    </form>
  )
}