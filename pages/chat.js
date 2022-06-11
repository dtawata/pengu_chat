import styles from '../styles/Chat.module.css';
import { useState, useRef, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { getUser } from '../lib/db';
import Rooms from '../components/rooms/Rooms';
import Channels from '../components/channels/Channels';
import Conversation from '../components/conversation/Conversation';
import Users from '../components/users/Users';

const Chat = (props) => {
  const { session, user } = props;
  const [socket, setSocket] = useState(null);
  const [conversation, setConversation] = useState([]);
  const history = useRef({});
  const [rooms, setRooms] = useState([]);
  const room = useRef({});
  const [channels, setChannels] = useState([]);
  const channel = useRef({});
  const [users, setUsers] = useState([]);
  const ref = useRef({});
  const isPrivate = useRef(false);
  const messagesRef = useRef();
  const messageRef = useRef();

  useEffect(() => {
    const newSocket = io('http://localhost:3001', { autoConnect: false });
    setSocket(newSocket);
  }, [])

  useEffect(() => {
    if (socket) {

      socket.on('initialize', async ({ rooms, channels }) => {

        for (let room of rooms) {
          history.current[room.path] = {};
          ref.current[room.path] = { channels: [], users: {} };
        }

        for (let channel of channels) {
          history.current[channel.room][channel.path] = null;
          ref.current[channel.room].channels.push(channel);
        }

        room.current = rooms[0];
        channel.current = ref.current[room.current.path].channels[0];
        setRooms(rooms);
        setChannels(ref.current[room.current.path].channels);

        if (channel.current) {
          const messages = await axios.get('/api/messages', {
            params: {
              roomId: room.current.id,
              channelId: channel.current.id
            }
          });
          history.current[room.current.path][channel.current.path] = messages.data;
          setConversation(messages.data);
        }

        const users = await axios.get('/api/users', {
          params: {
            roomId: room.current.id
          }
        });

        for (let user of users.data) {
          ref.current[room.current.path].users[user.username] = user;
          ref.current[room.current.path].users[user.username].online = false;
        }
        setUsers(Object.values(ref.current[room.current.path].users));
        socket.emit('getOnlineUsers', room.current);
      });

      socket.on('initializeOnlineUsers', (onlineUsers) => {
        for (let onlineUser of onlineUsers) {
          ref.current[room.current.path].users[onlineUser].online = true;
        }
        setUsers(Object.values(ref.current[room.current.path].users));
      });

      socket.on('addOnlineUser', (username) => {
        if (ref.current[room.current.path].users[username]) {
          ref.current[room.current.path].users[username].online = true;
        }
        setUsers(Object.values(ref.current[room.current.path].users));
      });

      socket.on('removeOnlineUser', (username) => {
        if (ref.current[room.current.path].users[username]) {
          ref.current[room.current.path].users[username].online = false;
        }
        setUsers(Object.values(ref.current[room.current.path].users));
      });

      socket.on('receiving', (data) => {
        if (history.current[data.room][data.channel]) {
          history.current[data.room][data.channel].push(data);
          if (channel.current.name === data.channel) {
            const temp = history.current[data.room][data.channel].slice();
            setConversation(temp);
          }
        }
      });

      socket.auth = user;
      socket.connect();
    }
  }, [socket, user])

  const changeRoom = async (newRoom) => {
    isPrivate.current = false;
    room.current = newRoom;
    channel.current = ref.current[room.current.path].channels[0];
    setChannels(ref.current[room.current.path].channels);

    if (channel.current) {
      const messages = await axios.get('/api/messages', {
        params: {
          roomId: room.current.id,
          channelId: channel.current.id
        }
      });
      history.current[room.current.path][channel.current.path] = messages.data;
      setConversation(messages.data);
    } else {
      setConversation([]);
    }

    const users = await axios.get('/api/users', {
      params: {
        roomId: room.current.id
      }
    });

    for (let user of users.data) {
      ref.current[room.current.path].users[user.username] = user;
      ref.current[room.current.path].users[user.username].online = false;
    }
    setUsers(Object.values(ref.current[room.current.path].users));
    socket.emit('getOnlineUsers', room.current);
  };

  const changeChannel = async (newChannel) => {
    isPrivate.current = false;
    channel.current = newChannel;
    if (history.current[room.current.path][channel.current.path]) {
      setConversation(history.current[room.current.path][channel.current.path]);
    } else {
      const res = await axios.get('/api/messages', {
        params: {
          roomId: room.current.id,
          channelId: channel.current.id
        }
      });
      history.current[room.current.path][channel.current.path] = res.data;
      setConversation(res.data);
    }
  };

  const changePrivateRoom = async (newUser) => {
    isPrivate.current = true;
    room.current.id = newUser.id;
    room.current.name = newUser.username;
    room.current.namespace_id = 1;
    if (history.current[room.current.namespace_id][room.current.name]) {
      setConversation(history.current[room.current.namespace_id][room.current.name]);
    } else {
      const res = await axios.get('/api/personal', {
        params: {
          to: room.current.id
        }
      });
      history.current[room.current.namespace_id][room.current.name] = res.data;
      setConversation(res.data);
    }
  };

  const addRoom = async () => {
    console.log('add room');
  };

  useEffect(() => {
    messageRef.current.value = '';
    // messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [conversation])

  return (
    <div className={styles.chat}>
      <Rooms rooms={rooms} changeRoom={changeRoom} addRoom={addRoom} />
      <Channels channels={channels} channel={channel} room={room} user={user} changeChannel={changeChannel} />
      <main className={styles.main}>
        <div className={styles.bar}># {channel.current ? channel.current.name : null }</div>
        <div className={styles.content}>
          <Conversation conversation={conversation} socket={socket} room={room} channel={channel} messageRef={messageRef} isPrivate={isPrivate} messagesRef={messagesRef} />
          <Users users={users} />
        </div>
      </main>
    </div>
  );
};

export default Chat;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const email = session.user.email;
  const user = await getUser(email);
  return {
    props: {
      session,
      user
    }
  }
};


  // socket.on('newRoom', (data) => {

  //     history.current[data.room.path] = {};
  //     groups.current[data.room.path] = [];
  //     users.current[data.room.path] = {};

  //   for (let i = 0; i < data.channels.length; i++) {
  //     history.current[data.channels[i].room][channels[i].path] = null;
  //     groups.current[data.channels[i].room].push(channels[i]);
  //   }

  //   console.log('newroom', data);
  // })

  // socket.on('receiving', (data) => {
  //   history.current[data.room][data.channel] = history.current[data.room][data.channel] || [];
  //   history.current[data.room][data.channel].push(data);
  //   if (channel.current.name === data.channel) {
  //     const temp = history.current[data.room][data.channel].slice();
  //     setConversation(temp);
  //   }
  // });



  // const addRoom = async (e) => {
  //   e.preventDefault();
  //   console.log(modal.current.value);
  //   const res = await axios.post('http://localhost:3000/api/addroom/', {
  //     name: modal.current.value,
  //     path: modal.current.value,
  //     image: null
  //   });
  //   console.log('res', res.data);
  //   socket.emit('join_room', res.data.insertId);
  //   setShowModal((prevState) => {
  //     return !prevState;
  //   });
  // }

  // const addChannel = async (e) => {
  //   e.preventDefault();
  //   const res = await axios.post('http://localhost:3000/api/addchannel/', {
  //     name: formChannel.current.value,
  //     path: formChannel.current.value,
  //     roomId: room.current.id
  //   });
  //   groups.current[room.current.path].push({
  //     id: res.data.insertId,
  //     name: formChannel.current.value,
  //     path: formChannel.current.value,
  //     room_id: room.current.id,
  //     room: room.current.path
  //   });
  //   setChannels(groups.current[room.current.path].slice());
  // };

