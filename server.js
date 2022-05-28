const express = require('express');
const app = express();
const { Server } = require('socket.io');
// const { getChannels } = require('./lib/db');
const server = app.listen(3001);
const io = new Server(server, {
  cors: {
    origin: true
  }
});
const { getOnlineUsers, getRooms, addMessage, addPersonalMessage, getNamespaces, getBaseRooms, getChannels  } = require('./lib/db_server');

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
    socket.join(room.name);
  }
  const channels = await getChannels(roomIds);
  socket.emit('rooms', { rooms, channels });

  // const onlineUsernames = [];
  // for (let [id, other] of io.of('/').sockets) {
  //     onlineUsernames.push(other.username);
  // }
  // for (let onlineUser of onlineUsers) {
  //   if (onlineUser.username === socket.username) {
  //     socket.broadcast.emit('onlineUsers', onlineUser);
  //     break;
  //   }
  // }
  // socket.emit('onlineUsers', onlineUsers);
  // // var clients= io.sockets.adapter.rooms['philosophy'].sockets
  // // const clients = io.sockets.clients('philosophy');
  // const sockets2 = await io.in('Philosophy').fetchSockets();
  // const well = [];

  // socket.emit('allUsers', sockets2[0].username);

  socket.on('getOnlineUsers', async (room) => {
    console.log(room);
    const sockets2 = await io.in(room.name).fetchSockets();
    const onlineUsernames = [];
    for (let i = 0; i < sockets2.length; i++) {
      onlineUsernames.push(sockets2[i].username);
    }
    const onlineUsers = await getOnlineUsers(onlineUsernames);

    socket.emit('onlineUsers', onlineUsers);
    socket.broadcast.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnecting', () => {
    socket.broadcast.emit('removeOnlineUser', socket.username);
  });

  socket.on('sending', async ({ message, room, channel }) => {
    const entry = await addMessage(socket.userId, room.id, channel.id, message);
    // io.to(room.name).emit('receiving', {
    io.emit('receiving', {
      id: entry.insertId,
      content: message,
      created_at: 'yesterday at 2:30 PM',
      image: '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
      room_id: room.id,
      room: room.path,
      user_id: socket.userId,
      username: socket.username,
      channel_id: channel.id,
      channel: channel.name
    });
  });

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

// const io2 = new Server(server, {
//   cors: {
//     origin: true
//   }
// });



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

