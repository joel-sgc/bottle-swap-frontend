'use client'

import Sortable, { Swap } from 'sortablejs';
import { Bottle } from '@/components/ui/bottle/Bottle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

Sortable.mount(new Swap())

export default function Page() { 
  const socket = io('ws://localhost:4000');
  const [bottleOrder, setBottleOrder] = useState(['magenta', 'red', 'orange', 'yellow', 'green', '']);     // The order of the bottles (not the correct order)
  const [roomCode, setRoomCode] = useState('Loading...'); // The room code
  const [nickname, setNickname] = useState('Anonymous');  // The user's nickname
  const [users, setUsers] = useState(new Map());          // The users in the room
  const [uuid, setUUID] = useState('Loading...');         // The user's UUID
  const [activeuuid, setActiveuuid] = useState('');       // The UUID of the user whose turn it is
  const [sortable, setSortable] = useState();
  const [left, setLeft] = useState(0);


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
  socket.on('turn-update', (newOrder, activePlayer) => {
    setBottleOrder(newOrder);
    setActiveuuid(activePlayer);  
  });

  // On Game Start
  socket.on('start-game', (uuid) => {
    setActiveuuid(uuid);
  });

  // After every move
  socket.on('move', (newOrder, activePlayerUUID) => {
    if (activePlayerUUID !== sessionStorage.getItem('bottle-swap-uuid')) {
      var elems = document.getElementById('bottleContainer').children;

      var currentOrder = [];
      for (let i = 0; i < elems.length; i++) {
        currentOrder.push(elems[i].children[0].getAttribute('variant'));
      }

      let elementGoRight = null, elementGoLeft = null, distance = -1;

      for (let i = 0; i < newOrder.length; i++) {
        if (newOrder[i] !== currentOrder[i]) {
          if (elementGoRight === null) {
            elementGoRight = elems[i].children[0];
            distance = 0;
          } else {
            elementGoLeft = elems[i].children[0];
            break;
          }
        }

        if (distance !== -1) distance += 200;
      }

      elementGoRight.style.transform = `translateX(${distance}px)`;
      elementGoLeft.style.transform = `translateX(-${distance}px)`;

      setTimeout(() => {
        elementGoLeft.style.transform = 'unset';
        elementGoRight.style.transform = 'unset';
        setBottleOrder(newOrder);
      }, 150)
    }
  });

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
    if (document) {
      Sortable.prototype.moveItem = (index, toIndex) => {
        var itemEl = this.el.children[index],
        toEl = this.el.children[toIndex];
  
        this.el.insertBefore(itemEl, toEl && (+toIndex ? toEl.nextElementSibling : toEl));
      }


      setSortable(Sortable.create(document.getElementById('bottleContainer'), {
        swap: true,
        animation: 150,
        direction: 'horizontal',

        onEnd: function (evt) {
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
  
          socket.emit('move', roomCode, newOrder);
        }
      }));
    }

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
              {true ? (
                <>
                  <div variant={bottleOrder[0]}><Bottle className='cursor-pointer transition-transform' variant={bottleOrder[0]} key={bottleOrder[0]}/></div>
                  <div variant={bottleOrder[1]}><Bottle className='cursor-pointer transition-transform' variant={bottleOrder[1]} key={bottleOrder[1]}/></div>
                  <div variant={bottleOrder[2]}><Bottle className='cursor-pointer transition-transform' variant={bottleOrder[2]} key={bottleOrder[2]}/></div>
                  <div variant={bottleOrder[3]}><Bottle className='cursor-pointer transition-transform' variant={bottleOrder[3]} key={bottleOrder[3]}/></div>
                  <div variant={bottleOrder[4]}><Bottle className='cursor-pointer transition-transform' variant={bottleOrder[4]} key={bottleOrder[4]}/></div>
                  <div variant={bottleOrder[5]}><Bottle className='cursor-pointer transition-transform' variant={bottleOrder[5]} key={bottleOrder[5]}/></div>
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

                socket.emit('turn-complete', roomCode, newOrder, uuid);
              }}>Done</Button>
            )}
          </div>

          <hr/>

          <h2>Client UUID: {uuid}</h2>
          <h2>Room Code: {roomCode}</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (uuid === 'Loading...' || roomCode === 'Loading...' || e.target.roomCode.value.trim().length !== 6) return;

            let code = e.target.roomCode.value;
            let { newPlayers, newOrder } = await socket.emitWithAck('join-room', uuid, code, nickname);
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

          <h2>Users:</h2>
          <ul style={{paddingLeft: '40px'}}>
            {Array.from(users.values()).length > 0 ? (
            Array.from(users.values()).map((user, index) => (
                <li style={{listStyle: 'initial'}} key={index}>{user}</li>
              ))
              ) : (
              <li style={{listStyle: 'initial'}} key='Default'>Anonymous</li>
            )}
          </ul>
        </div>

      </section>

      <section className='flex'>
      </section>
    </main>
  );
}
