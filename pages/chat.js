import styles from '../styles/Chat2.module.css';
import Rooms from '../components/rooms/Rooms';
import Channels from '../components/channels/Channels';
import Conversation from '../components/conversation/Conversation';
import axios from 'axios';
import Users from '../components/users/Users';
import { useState, useRef, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { getUser } from '../lib/db';
import { io } from 'socket.io-client';

const Chat = (props) => {
  const { session, user } = props;
  const [socket, setSocket] = useState(null);

  const history = useRef({});
  const groups = useRef({});

  const [rooms, setRooms] = useState([]);
  const room = useRef({});

  const [channels, setChannels] = useState([]);
  const channel = useRef({});

  const [conversation, setConversation] = useState([]);
  const isPrivate = useRef(false);
  const messagesRef = useRef();
  const messageRef = useRef();


  // const [users, setUsers] = useState([]);
  const users = useRef({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);

  // APPROVED
  useEffect(() => {
    const newSocket = io('http://localhost:3001', { autoConnect: false });
    setSocket(newSocket);
  }, [])

  // APPROVED
  const changeRoom = async (newRoom) => {
    isPrivate.current = false;
    room.current = newRoom;

    const userData = await axios.get('http://localhost:3000/api/users', {
      params: {
        roomId: room.current.id
      }
    });
    users.current[room.current.path].online = {};
    users.current[room.current.path].offline = {};
    for (let i = 0; i < userData.data.length; i++) {
      users.current[room.current.path].offline[userData.data[i].username] = userData.data[i];
    }

    setOfflineUsers(Object.values(users.current[room.current.path].offline));

    socket.emit('getOnlineUsers', room.current);

    channel.current = groups.current[room.current.path][0];
    setChannels(groups.current[room.current.path]);

    if (history.current[room.current.path][channel.current.path]) {
      setConversation(history.current[room.current.path][channel.current.path]);
    } else {
      const res = await axios.get('http://localhost:3000/api/messages', {
        params: {
          channelId: channel.current.id
        }
      });
      history.current[room.current.path][channel.current.path] = res.data;
      setConversation(res.data);
    }
  };


  // APPROVED
  const changeChannel = async (newChannel) => {
    isPrivate.current = false;
    channel.current = newChannel;
    if (history.current[room.current.path][channel.current.path]) {
      setConversation(history.current[room.current.path][channel.current.path]);
    } else {
      const res = await axios.get('http://localhost:3000/api/messages', {
        params: {
          channelId: channel.current.id
        }
      });
      history.current[room.current.path][channel.current.path] = res.data;
      setConversation(res.data);
    }
  };

  useEffect(() => {
    console.log('ou', offlineUsers);
  }, [offlineUsers])


  useEffect(() => {
    if (socket) {

      socket.on('rooms', ({ rooms, channels }) => {
        for (let i = 0; i < rooms.length; i++) {
          history.current[rooms[i].path] = {};
          groups.current[rooms[i].path] = [];
          users.current[rooms[i].path] = {};
        }

        for (let i = 0; i < channels.length; i++) {
          history.current[channels[i].room][channels[i].path] = null;
          groups.current[channels[i].room].push(channels[i]);
        }

        room.current = rooms[0];
        setRooms(rooms);
        channel.current = groups.current[room.current.path][0];
        setChannels(groups.current[room.current.path]);
      });

      socket.on('receiving', (data) => {
        history.current[data.room][data.channel] = history.current[data.room][data.channel] || [];
        history.current[data.room][data.channel].push(data);
        console.log(history.current);
        if (channel.current.name === data.channel) {
          const temp = history.current[data.room][data.channel].slice();
          setConversation(temp);
        }
      });

      socket.on('newLogIn', (data) => {
        console.log('yo', data);
        users.current[data.room].online[data.username] = data;
        delete users.current[data.room].offline[data.username];
        setOnlineUsers(Object.values(users.current[room.current.path].online));
        setOfflineUsers(Object.values(users.current[room.current.path].offline));
      });

      socket.on('onlineUsers', (wsOnlineUsers) => {
        for (let i = 0; i < wsOnlineUsers.length; i++) {
          console.log('ws', wsOnlineUsers);
          users.current[room.current.path].online[wsOnlineUsers[i].username] = wsOnlineUsers[i];
          delete users.current[room.current.path].offline[wsOnlineUsers[i].username];
        }
        setOnlineUsers(Object.values(users.current[room.current.path].online));
        setOfflineUsers(Object.values(users.current[room.current.path].offline));
      });

      socket.on('removeOnlineUser', (wsOnlineUser) => {
        console.log(wsOnlineUser);
        users.current[room.current.path].offline[wsOnlineUser.username] = users.current[room.current.path].online[wsOnlineUser];
        delete users.current[room.current.path].online[wsOnlineUser];
        setOnlineUsers(Object.values(users.current[room.current.path].online));
        setOfflineUsers(Object.values(users.current[room.current.path].offline));
      });

      socket.auth = user;
      socket.connect();
    }
  }, [socket, user])

  useEffect(() => {
    messageRef.current.value = '';
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [conversation])

useEffect(() => {
  console.log(onlineUsers);
}, [onlineUsers])


  const changePrivateRoom = async (newUser) => {
    isPrivate.current = true;
    room.current.id = newUser.id;
    room.current.name = newUser.username;
    room.current.namespace_id = 1;
    if (history.current[room.current.namespace_id][room.current.name]) {
      setConversation(history.current[room.current.namespace_id][room.current.name]);
    } else {
      const res = await axios.get('http://localhost:3000/api/personal', {
        params: {
          to: room.current.id
        }
      });
      history.current[room.current.namespace_id][room.current.name] = res.data;
      setConversation(res.data);
    }
  };

  return (
    <div className={styles.chat}>
      <Rooms rooms={rooms} changeRoom={changeRoom} />
      <Channels channels={channels} channel={channel} changeChannel={changeChannel} room={room} />
      <div className={styles.main}>
        <div className={styles.bar}># {room.current.name}</div>
        <div className={styles.content}>
          <Conversation conversation={conversation} messagesRef={messagesRef} socket={socket} room={room} channel={channel} isPrivate={isPrivate} messageRef={messageRef} />
          <Users onlineUsers={onlineUsers} users={offlineUsers} changePrivateRoom={changePrivateRoom} />
        </div>
      </div>
    </div>
  )
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