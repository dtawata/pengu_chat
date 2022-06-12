const express = require('express');
const app = express();
const { Server } = require('socket.io');
const server = app.listen(3001);
const io = new Server(server, {
  cors: {
    origin: true
  }
});

const { getRooms, getChannels, getUser, addMessage, getRoom } = require('./lib/db_server');

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

// EVENT - connection
io.on('connection', async (socket) => {

  // EVENT - connection // initialize
  socket.join(socket.username);
  socket.broadcast.emit('addOnlineUser', socket.username);
  // const user = await getUser(socket.username);
  const rooms = await getRooms(socket.userId);
  const roomIds = [];
  for (let room of rooms) {
    roomIds.push(room.id);
    socket.join(room.path);
  }
  const channels = await getChannels(roomIds);
  socket.emit('initialize', { rooms, channels });

  // EVENT - getOnlineUsers // initializeOnlineUsers
  socket.on('getOnlineUsers', async ({ path }) => {
    const sockets = await io.in(path).fetchSockets();

    const onlineUsers = [];
    for (let i = 0; i < sockets.length; i++) {
      onlineUsers.push(sockets[i].username);
    }
    socket.emit('initializeOnlineUsers', onlineUsers);
  });

  // EVENT - disconnecting // removeOnlineUser
  socket.on('disconnecting', () => {
    socket.broadcast.emit('removeOnlineUser', socket.username);
  });

  // EVENT - sending
  socket.on('sending', async ({ message, room, channel }) => {
    console.log(message)
    console.log(room.id)
    console.log(channel.id)
    console.log(socket.userId)
    const now = new Date();
    const entry = await addMessage(socket.userId, room.id, channel.id, message, now);
    console.log('?!?', entry);
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
    console.log('join rooms', room)
    socket.emit('addRoom', { room, channels });
  });

});