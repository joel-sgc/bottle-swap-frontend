'use client'

import { Bottle } from '@/components/ui/bottle/Bottle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Sortable, { Swap } from 'sortablejs';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import JSConfetti from 'js-confetti';
import { v4 as uuidv4 } from 'uuid';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
Sortable.mount(new Swap())

export default function Page() { 
  const socket = io('ws://localhost:4000');
  const [bottleOrder, setBottleOrder] = useState(['magenta', 'red', 'orange', 'yellow', 'green', '']);     // The order of the bottles (not the correct order)
  const [roomCode, setRoomCode] = useState('Loading...'); // The room code
  const [nickname, setNickname] = useState('Anonymous');  // The user's nickname
  const [users, setUsers] = useState(new Map());          // The users in the room
  const [uuid, setUUID] = useState('Loading...');         // The user's UUID
  const [activeuuid, setActiveuuid] = useState('');       // The UUID of the user whose turn it is
  const [correctCount, setCorrectCount] = useState(0);
  const [confetti, setConfetti] = useState(null);

  socket.on('update-users', (players) => {
    let playerData = new Map(JSON.parse(players));

    setUsers(playerData);
  });

  socket.on('user-left', ( uuid ) => {
    // Remove user from room
    let newUsers = new Map(users);
    newUsers.delete(uuid);

    setUsers(newUsers);
  });

  // When it's someone else's turn
  socket.on('turn-update', (newOrder, activePlayer, players, newCount) => {
    setBottleOrder(newOrder);
    setActiveuuid(activePlayer);
    setUsers(new Map(JSON.parse(players)));
    setCorrectCount(newCount);
  });

  // On Game Start
  socket.on('start-game', (uuid) => {
    setActiveuuid(uuid);
  });

  // After every move
  socket.on('move', (newOrder) => {
    var elems = document.getElementById('bottleContainer').children;
    
    var currentOrder = [];
    for (let i = 0; i < elems.length; i++) {
      currentOrder.push(elems[i].getAttribute('variant'));
    }

    // If no change, return
    if (currentOrder === newOrder) return;

    let elementGoRight = null, elementGoLeft = null, distance = -1;

    for (let i = 0; i < newOrder.length; i++) {
      if (newOrder[i] !== currentOrder[i]) {
        if (elementGoRight === null) {
          elementGoRight = elems[i];
          distance = 0;
        } else {
          elementGoLeft = elems[i];
          break;
        }
      }

      if (distance !== -1) distance += 200;
    }

    if (elementGoLeft && elementGoRight) {
      elementGoLeft.style.transition = 'transform 0.2s ease-in-out';
      elementGoRight.style.transition = 'transform 0.2s ease-in-out';
  
      elementGoLeft.style.transform = `translateX(-${distance}px)`;
      elementGoRight.style.transform = `translateX(${distance}px)`;
  
      setTimeout(() => {
        elementGoLeft.style.transition = '';
        elementGoRight.style.transition = '';
        elementGoLeft.style.transform = '';
        elementGoRight.style.transform = '';
        setBottleOrder(newOrder);
      }, 200) 
    }
  });

  socket.on('game-over', (winner, newOrder) => {
    setBottleOrder(newOrder);
    setCorrectCount(6);

    if (winner.uuid === uuid) {
      confetti.addConfetti();
    }
  })

  useEffect(() => {
    // UUID generation and setting
    let newUUID = uuidv4();

    // // If we don't have a uuid in sessio nStorage, set it
    // // Otherwise, set the uuid state to the uuid in sessionStorage
    if (!sessionStorage.getItem('bottle-swap-uuid')) {
      sessionStorage.setItem('bottle-swap-uuid', newUUID);
      setUUID(newUUID)
    } else {
      setUUID(sessionStorage.getItem('bottle-swap-uuid'))
    }

    // Confetti
    if (!confetti) {
      setConfetti(new JSConfetti());
    }
    
    // Generate a new room code
    const generateRoom = async() => {
      let data = await socket.emitWithAck('get-new-code', sessionStorage.getItem('bottle-swap-uuid'), nickname)
      
      setRoomCode(data.code);
      setBottleOrder(data.bottles);
    }
    generateRoom();
  }, [])

  // Disconnection stuff
  useEffect(() => {
    if (uuid === 'Loading...' || roomCode === 'Loading...') return;

    const disconnect = () => {
      socket.emit('check-disconnect', uuid, roomCode);
    }

    // Sortable stuff
    Sortable.create(document.getElementById('bottleContainer'), {
      swap: true,
      animation: 150,
      direction: 'horizontal',

      onEnd: function (evt) {
        var itemEl = evt.item;  // dragged HTMLElement
        evt.to;    // target list
        evt.from;  // previous list
        evt.oldIndex;  // element's old index within old parent
        evt.newIndex;  // element's new index within new parent
        evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
        evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
        evt.clone // the clone element
        evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving

        var elemContainer = document.getElementById('bottleContainer')

        let newOrder = [];
        for (let i = 0; i < elemContainer.children.length; i++) {
          newOrder.push(elemContainer.children[i].children[0].getAttribute('variant'));
        }
        
        // The reason we're not using the state is because the state is not updated within this function.
        // It takes the value, but not the reference, so this function will have the wrong value.
        socket.emit('move', itemEl.getAttribute('roomCode'), newOrder, sessionStorage.getItem('bottle-swap-uuid'));
      } 
    });

    // When the user leaves the page, close the socket
    window.addEventListener('beforeunload', disconnect);

    return () => {
      window.removeEventListener('beforeunload', disconnect)
    }
  }, [roomCode])

  return (
    <main className='container h-screen flex items-center justify-center flex-col gap-8'>
      <section>
        <div className='flex gap-8 flex-col'> 
          <div className='flex flex-col gap-8' style={{minHeight: '272px'}}>
            <div id='bottleContainer' className='relative flex'>
              {activeuuid === uuid ? (
                <>
                  <div variant={bottleOrder[0]} roomcode={roomCode}><Bottle className='cursor-pointer' variant={bottleOrder[0]} key={bottleOrder[0]}/></div>
                  <div variant={bottleOrder[1]} roomcode={roomCode}><Bottle className='cursor-pointer' variant={bottleOrder[1]} key={bottleOrder[1]}/></div>
                  <div variant={bottleOrder[2]} roomcode={roomCode}><Bottle className='cursor-pointer' variant={bottleOrder[2]} key={bottleOrder[2]}/></div>
                  <div variant={bottleOrder[3]} roomcode={roomCode}><Bottle className='cursor-pointer' variant={bottleOrder[3]} key={bottleOrder[3]}/></div>
                  <div variant={bottleOrder[4]} roomcode={roomCode}><Bottle className='cursor-pointer' variant={bottleOrder[4]} key={bottleOrder[4]}/></div>
                  <div variant={bottleOrder[5]} roomcode={roomCode}><Bottle className='cursor-pointer' variant={bottleOrder[5]} key={bottleOrder[5]}/></div>
                </>
              ) : (
                bottleOrder.map((bottle) => (<Bottle variant={bottle} key={bottle}/>))
              )}
            </div>
            {(activeuuid === uuid) && (
              <Button key={activeuuid} className='w-full' onClick={() => {
                var elem = document.getElementById('bottleContainer')
              
                let newOrder = [];
                for (let i = 0; i < elem.children.length; i++) {
                  newOrder.push(elem.children[i].children[0].getAttribute('variant'));
                }
              
                setBottleOrder(newOrder);
              
                socket.emit('turn-complete', roomCode, newOrder, uuid);
              }}>Done</Button>              
            )}
          </div>

          <hr/>

          {users.get(uuid) && <h1>Correct Count: {correctCount}</h1>}
          {users.get(uuid) && <h2>Score: {users.get(uuid).score}</h2>}
          <h2>Client UUID: {uuid}</h2>
          <h2>Room Code: {roomCode}</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (uuid === 'Loading...' || roomCode === 'Loading...' || e.target.roomCode.value.trim().length !== 6) return;

            let code = e.target.roomCode.value;
            let { newPlayers, newOrder } = await socket.emitWithAck('join-room', uuid, roomCode, code, nickname);
            setBottleOrder(newOrder);
            setUsers(new Map(JSON.parse(newPlayers)));
            
            e.target.reset();

            setRoomCode(code);
          }} className='flex gap-2'>
            <Input type='text' name='roomCode' placeholder="Enter Room Code..."/>
            <Button type='submit'>Join Room</Button>
          </form>
          
          <hr/>

          <h2>Nickname: {nickname}</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (uuid === 'Loading...' || roomCode === 'Loading...' || e.target.nickname.value === '') return;
            setNickname(e.target.nickname.value);

            let newPlayerData = await socket.emitWithAck('set-nickname', uuid, e.target.nickname.value, roomCode);
            let playerData = new Map(JSON.parse(newPlayerData));

            // Set the users nicknames to the new Map
            setUsers(playerData);
            e.target.reset();
          }} className='flex gap-2'>
            <Input type='text' name='nickname' placeholder="Enter Nickname..."/>
            <Button type='submit'>Set Nickname</Button>
          </form>

          <hr/>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(users.values()).length > 0 ? (
                Array.from(users.values()).map(({name, score}, index) => (
                  <TableRow key={index}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{score}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key='Default'>
                  <TableCell>{nickname}</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
