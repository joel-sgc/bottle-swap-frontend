import { Server } from 'socket.io'


const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const colorOptions = ['red', 'white', 'rose', 'green', 'yellow', 'orange', 'magenta', ''];

const io = new Server(4000);
const rooms = new Map();

// Imma be so incredibly honest, I was having so many issues with a lot of these socket.io events
// I couldn't quite figure out how to get the data I needed to the right places so I took a couple
// days break. When I came back, it worked. I don't know what I did, but it works now. If it breaks,
// give it a couple days and it'll probably work again.

io.on('connection', async (socket) => {
  // Debug event
  socket.on('console', (args) => console.log(args));

  // We generate 6-length string that corresponds to the current room
  // Other users can then connect to this room through this room code
  socket.on("get-new-code", (uuid, nickname, callback) => {
    let roomCode = generateRoomCode();
    let bottleOrders = getBottles(colorOptions);

    // Create a new room with the room code as the key
    rooms.set(roomCode, {
      correctOrder: bottleOrders.originalArray,
      currentOrder: bottleOrders.shuffledArray,
      activePlayer: uuid,
      players: new Map()
    });

    rooms.get(roomCode).players.set(uuid, nickname);
    socket.join(roomCode);

    callback({code: roomCode, bottles: bottleOrders.shuffledArray});
  });

  // Get users in room
  socket.on('get-users', async (roomCode, callback) => {
    // This is a hacky way to get the number of users in a room
    let players = Array.from(rooms.get(roomCode).players);

    callback(JSON.stringify(players));
  });

  // Join room and let the other users know
  socket.on('join-room', (uuid, oldRoomCode, roomCode, nickname, callback) => {
    socket.join(roomCode);

    // Delete the user from the old room
    rooms.get(oldRoomCode)?.players.delete(uuid);

    // If the old room is empty, delete it
    if (rooms.get(oldRoomCode)?.players.size === 0) {
      rooms.delete(oldRoomCode);
    } 

    rooms.get(roomCode)?.players.set(uuid, nickname);

    // Have to convert the Map and take shortcuts because socket.io doesn't support sending Maps
    let players = Array.from(rooms.get(roomCode)?.players);
    socket.to(roomCode).emit('update-users', JSON.stringify(players));
    
    if (rooms.get(roomCode)?.players.size === 2) {
      socket.in(roomCode).emit('start-game', (rooms.get(roomCode).activePlayer));
    }

    callback({ newPlayers: JSON.stringify(players), newOrder: rooms.get(roomCode).currentOrder });
  });

  // Set nickname
  socket.on('set-nickname', async(uuid, nickname, roomCode, callback) => {
    // Set the nickname and send it to the room
    socket.nickname = nickname;
    rooms.get(roomCode)?.players.set(uuid, nickname);

    // Have to convert the Map and take shortcuts because socket.io doesn't support sending Maps
    let players = Array.from(rooms.get(roomCode)?.players);

    socket.to(roomCode).emit('update-users', JSON.stringify(players));
    callback(JSON.stringify(players));
  })

  // After every move
  socket.on('move', (roomCode, newOrder) => {
    if (roomCode === "Loading..." || !rooms.has(roomCode)) return;

    // Set the new order and send it to the room
    const room = rooms.get(roomCode);
    if (room) {
      room.currentOrder = newOrder;
      socket.in(roomCode).emit('move', newOrder);
    }
  });


  // After every turn
  socket.on('turn-complete', (roomCode, newOrder, currentPlayer) => {
    // Check if the room exists
    if (!rooms.has(roomCode)) {
      console.error(`Room with code ${roomCode} not found.`);
      return;
    }
  
    const room = rooms.get(roomCode);
    if (!room) {
      console.error(`Failed to retrieve room data for code ${roomCode}.`);
      return;
    }
  
    // Find next active user
    let playerArray = Array.from(room.players?.keys() || []);
  
    let currentIndex = playerArray.indexOf(currentPlayer);
    let nextIndex = (currentIndex + 1) % playerArray.length;
  
    let newPlayer = playerArray[nextIndex];
  
    // Set the new order
    room.currentOrder = newOrder;
  
    // Send the new order and the new active player to the room
    socket.to(roomCode).emit('turn-update', newOrder, newPlayer);
  });
  

  // Check if we need to remove any empty rooms from our rooms Map
  socket.on('check-disconnect', (uuid, roomCode) => {
    // Remove player from that rooms Map
    rooms.get(roomCode)?.players.delete(uuid);

    if (rooms.get(roomCode)?.players.size === 0) {
      // If empty, delete the room from the Map
      rooms.delete(roomCode);
    } else {
      // If not empty, send a message to the other users in the room that this user left
      socket.to(roomCode).emit('user-left', uuid);
    }
  })
});

// Room Layout
// roomCode: {
//   correctOrder: [ 'purple', 'orange', 'red', 'green', 'white' ],
//   currentOrder: [ 'white', 'green', 'purple', 'orange', 'red' ],
//   players: [
//     [ 'uuid', 'nickname' ],
//     [ 'uuid', 'nickname' ],
//     [ 'uuid', 'nickname' ],
//     ...
//   ]
// }

function generateRoomCode() {
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  // Check if the code has already been used
  if (io.sockets.adapter.rooms.has(result)) {
    return generateRoomCode();
  }

  return result;
}

export function getRandomItems(array, count) {
  const shuffled = array.slice(); // Make a copy of the original array
  let currentIndex = shuffled.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Swap it with the current element
    temporaryValue = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }

  return shuffled.slice(0, count); // Return the first 'count' elements
}


function getBottles(arr) {
  // Stole this right from StackOverflow
  // Picks 6 random elements from the colorOptions array
  const n = 6;
  const originalArray = [...arr]
    .map(x => ({ x, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(a => a.x)
    .slice(0, n);

  // Derrangement function that ChatGPT wrote for me 🥰😍
  let shuffledArray = [...originalArray];

  do {
    shuffledArray = shuffledArray.sort(() => Math.random() - 0.5);
  } while (!isDerangement(originalArray, shuffledArray));

  return { originalArray, shuffledArray };
}

function isDerangement(arr1, arr2) {
  return arr1.every((value, index) => value !== arr2[index]);
}