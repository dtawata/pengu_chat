const express = require('express');
const app = express();
const { Server } = require('socket.io');
const server = app.listen(3001);
const io = new Server(server, {
  cors: {
    origin: true
  }
});

const { getRoom, getRooms, getChannels, getOnlineUsers, addMessage, addPersonalMessage  } = require('./lib/db_server');

// Middleware
io.use((socket, next) => {
  const userId = socket.handshake.auth.id;
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.userId = userId;
  socket.username = username;
  next();
});

// Connection
io.on('connection', async (socket) => {
  socket.join(socket.username);

  const rooms = await getRooms(socket.userId);
  const roomIds = [];
  for (let room of rooms) {
    roomIds.push(room.id);
    socket.join(room.path);
  }
  const channels = await getChannels(roomIds);
  socket.emit('initializeRooms', { rooms, channels });

  socket.on('getOnlineUsers', async (room) => {
    const sockets2 = await io.in(room.path).fetchSockets();
    const onlineUsernames = [];
    for (let i = 0; i < sockets2.length; i++) {
      onlineUsernames.push(sockets2[i].username);
    }
    const onlineUsers = await getOnlineUsers(onlineUsernames);
    let newUser = null;
    for (let i = 0; i < onlineUsers.length; i++) {
      if (onlineUsers[i].id === socket.userId) {
        newUser = onlineUsers[i];
        break;
      }
    }
    socket.emit('onlineUsers', onlineUsers);
    socket.broadcast.emit('newLogIn', { ...newUser, room: room.path });

    // socket.broadcast.emit('newLogIn', 'hello');
  });

  socket.on('disconnecting', () => {
    socket.broadcast.emit('removeOnlineUser', socket.username);
  });

  socket.on('sending', async ({ message, room, channel }) => {
    const now = new Date();
    const entry = await addMessage(socket.userId, room.id, channel.id, message, now);
    // io.to(room.name).emit('receiving', {
    io.emit('receiving', {
      id: entry.insertId,
      content: message,
      created_at: now.toISOString(),
      image: '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
      room_id: room.id,
      room: room.path,
      user_id: socket.userId,
      username: socket.username,
      channel_id: channel.id,
      channel: channel.name
    });
  });

  socket.on('join_room', async (roomId) => {
    const room = await getRoom({ userId: socket.userId, roomId: roomId});
    socket.join(room.path);
    const channels = await getChannels([room.id]);
    socket.emit('newRoom', { room, channels });
  })

  socket.on('sending_private', async ({ message, room }) => {
    const wait = await addPersonalMessage(socket.userId, room.id, message);
    socket.emit('receiving', {
      id: wait.insertId,
      content: message,
      created_at: 'yesterday at 2:30 PM',
      image: '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
      room_id: room.id,
      room: room.name,
      user_id: socket.userId,
      username: socket.username
    });
    socket.to(room.name).emit('receiving', {
      id: socket.userId,
      content: message,
      created_at: 'yesterday at 2:30 PM',
      image: '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
      room_id: socket.userId,
      room: socket.username,
      user_id: socket.userId,
      username: socket.username
    });
  });

});


// io.use((socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   if (sessionID) {
//     // find existing session
//     const session = sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       socket.username = session.username;
//       return next();
//     }
//   }
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   // create new session
//   socket.sessionID = 'De3ifPk4JPgGfYuDAAAD';
//   socket.userID = 'De3ifPk4JPgGfYuDAAAD25';
//   socket.username = username;
//   next();
// });






// // io.use((socket, next) => {
// //   console.log(socket.handshake);
// //   const username = socket.handshake.auth.username;
// //   if (!username) {
// //     return next(new Error("invalid username"));
// //   }
// //   socket.username = username;
// //   next();
// // });

// io.on('connection', async (socket) => {
//   socket.join(socket.username);
  // const users = [];
  // for (let [id, socket] of io.of('/').sockets) {
  //   const user = { id, username: socket.username };
  //   users.push(user);
  // }
  // socket.emit('users', users);

//   // socket.emit("session", {
//   //   sessionID: socket.sessionID,
//   //   userID: socket.userID,
//   // });

//   socket.on('sending', async (message) => {
//     const wait = await addMessage(message);
//     const { username } = socket;
//     io.emit('receiving', { username, message });
//   });

//   socket.on('privatemessage', (form) => {
//     console.log(socket.username);
//     socket.emit('receiving_pm', form.privateMessage);
//     socket.to(form.to).emit('receiving_pm', form.privateMessage);
//   })

// });

























// // io.on('connect', (socket) => {
// //   console.log(socket.id);
// //   socket.on('message', (msg) => {
// //     io.emit('everyone', { id: socket.username, msg });
// //   })
// // })

// io.on("connection", (socket) => {
//   const users = [];
//   for (let [id, socket] of io.of("/").sockets) {
//     users.push({
//       userID: id,
//       username: socket.username,
//     });
//   }
//   socket.emit("users", users);

//   socket.on('message', (msg) => {
//     io.emit('everyone', { id: socket.username, msg });
//   })
//   // ...
// });

