import { Server } from 'socket.io'
import express from 'express';
import http from 'http'

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const colorOptions = ['red', 'white', 'rose', 'green', 'yellow', 'orange', 'magenta', ''];

// Server setup
const app = express();

const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
  console.log('hello');
});

server.listen(8080, () => {
  console.log('listening on *:8080');
});


const io = new Server(server, {cors: {origin: "*"}});
const rooms = new Map();
const playersRoomSize = 2;

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
      winningPlayer: {uuid: '', score: 0},
      players: new Map()
    });

    rooms.get(roomCode).players.set(uuid, {name: nickname, score: 0});
    socket.join(roomCode);

    callback({code: roomCode, bottles: bottleOrders.shuffledArray});
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

    let player = rooms.get(roomCode)?.players.get(uuid);
    rooms.get(roomCode)?.players.set(uuid, {name: nickname, score: player?.score || 0});

    // Have to convert the Map and take shortcuts because socket.io doesn't support sending Maps
    let players = Array.from(rooms.get(roomCode)?.players);
    socket.to(roomCode).emit('update-users', JSON.stringify(players));
    
    if (rooms.get(roomCode)?.players.size === playersRoomSize) {
      socket.in(roomCode).emit('start-game', (rooms.get(roomCode).activePlayer));
    }

    callback({ newPlayers: JSON.stringify(players), newOrder: rooms.get(roomCode).currentOrder });
  });

  // Set nickname
  socket.on('set-nickname', async(uuid, nickname, roomCode, callback) => {
    // Set the nickname and send it to the room
    socket.nickname = nickname;
    rooms.get(roomCode)?.players.set(uuid, {...rooms.get(roomCode)?.players.get(uuid), name: nickname});

    // Have to convert the Map and take shortcuts because socket.io doesn't support sending Maps
    let players = Array.from(rooms.get(roomCode)?.players);

    socket.to(roomCode).emit('update-users', JSON.stringify(players));
    callback(JSON.stringify(players));
  })

  // After every move
  socket.on('move', (roomCode, newOrder, uuid) => {
    if (roomCode === "Loading..." || !rooms.has(roomCode)) return;

    // Set the new order and send it to the room
    const room = rooms.get(roomCode);

    if (room) {
      // Score logic
      // Calculate score and send it to the room
      let correctBefore = 0,
          correctAfter = 0,
          correctOrder = room.correctOrder,
          currentOrder = room.currentOrder;

      // Calculate score difference
      correctOrder.forEach((color, index) => {
        if (color === currentOrder[index]) correctBefore++;
        if (color === newOrder[index]) correctAfter++;
      });


      let player = room.players.get(uuid);
      let score = correctAfter - correctBefore;

      if (score > room.winningPlayer.score) {
        room.winningPlayer = {uuid, score};
      }

      room?.players.set(uuid, {...player, score: player.score + score});

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

    // Check if the current order is correct
    if (newOrder.join('') === room.correctOrder.join('')) {
      // Set the new order
      room.currentOrder = newOrder;

      // Send the game over event to the room
      return socket.to(roomCode).emit('game-over', room.winningPlayer, newOrder);
    }

    // Find next active user
    let playerArray = Array.from(room.players?.keys() || []);
  
    let currentIndex = playerArray.indexOf(currentPlayer);
    let nextIndex = (currentIndex + 1) % playerArray.length;
  
    let newPlayer = playerArray[nextIndex];
  
    // Set the new order
    room.currentOrder = newOrder;

    let correctCount = 0;
    room.correctOrder.forEach((color, index) => {
      if (color === newOrder[index]) correctCount++;
    });
  
    // Send the new order and the new active player to the room
    socket.to(roomCode).emit('turn-update', newOrder, newPlayer, JSON.stringify(Array.from(room.players)), correctCount);
  });


  socket.on('play-again', (roomCode, player, callback) => {
    const room = rooms.get(roomCode);
    if (!room) {
      console.error(`Failed to retrieve room data for code ${roomCode}.`);
      return;
    }

    let bottleOrders = getBottles(colorOptions);
    room.currentOrder = bottleOrders.shuffledArray;
    room.players.clear();
    room.players.set(player.uuid, {name: player.name, score: 0});
    room.activePlayer = room.winningPlayer.uuid;
    room.winningPlayer = {uuid: '', score: 0};

    if (room.players.size === playersRoomSize) {
      socket.in(roomCode).emit('start-game', (rooms.get(roomCode).activePlayer));
      console.log('starting game')
    }

    callback(bottleOrders.shuffledArray);
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
