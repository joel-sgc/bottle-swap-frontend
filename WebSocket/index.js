import { Server } from 'socket.io'


const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const colorOptions = ['red', 'white', 'rose', 'green', 'yellow', 'orange', 'purple', 'magenta', 'lavender', ''];

const io = new Server(4000);
const rooms = new Map();

io.on('connection', async (socket) => {
  // Debug event
  socket.on('console', (args) => console.log(args));

  socket.on('register-player', (uuid, code, nickname) => {
    rooms.get(code).players.set(uuid, nickname);
  });

  // We generate 6-length string that corresponds to the current room
  // Other users can then connect to this room through this room code
  socket.on("get-new-code", (uuid, nickname, callback) => {
    let roomCode = generateRoomCode();
    let bottles = getRandomItems(colorOptions, 5);

    rooms.set(roomCode, {
      correctOrder: bottles,
      currentOrder: shuffleBottles(bottles),
      players: new Map()
    });

    rooms.get(roomCode).players.set(uuid, nickname);

    socket.join(roomCode);

    rooms.get(roomCode).players;
    callback(roomCode);
  });

  // Get users in room
  socket.on('get-users', async (roomCode, callback) => {
    let clients = io.sockets.adapter.rooms.get(roomCode);

    callback(clients.size);
  });

  // Join room and let the other users know
  socket.on('join-room', (uuid, roomCode, nickname, callback) => {
    socket.join(roomCode);

    rooms.get(roomCode).players.set(uuid, nickname);

    // Have to convert the Map and take shortcuts because socket.io doesn't support sending Maps
    let players = Array.from(rooms.get(roomCode).players);
    socket.to(roomCode).emit('user-joined', JSON.stringify(players));

    callback(JSON.stringify(players));
  });

  // Set nickname
  socket.on('set-nickname', async(uuid, nickname, roomCode) => {
    socket.nickname = nickname;
    rooms.get(roomCode).players.set(uuid, nickname);

    let players = Array.from(rooms.get(roomCode).players);
    socket.to(roomCode).emit('nickname-update', JSON.stringify(players));
  })

  // Check if we need to remove any empty rooms from our rooms Map
  socket.on('check-disconnect', (uuid, roomCode) => {
    // Remove player from that rooms Map
    rooms.get(roomCode).players.delete(uuid);
    
    if (rooms.get(roomCode).players.size === 0) {
      // If empty, delete the room from the Map
      rooms.delete(roomCode);
    } else {
      // If not empty, send a message to the other users in the room that this user left
      socket.to(roomCode).emit('user-left', uuid);
    }

  })
});


// Room Layout
// uuid: {
//   code: 'unique randomly generated string of length 6',
//   correctOrder: [ 'purple', 'orange', 'red', 'green', 'white' ],
//   currentOrder: [ 'white', 'green', 'purple', 'orange', 'red' ],
//   players: [
//     {
//       id: 'UUID HERE',
//       nickname: 'NICKNAME HERE'
//     }
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

export const shuffleBottles = (arr) => {
  let array = arr.slice();

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}