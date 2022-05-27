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

  const history = useRef({});
  const [conversation, setConversation] = useState([]);

  const [socket, setSocket] = useState(null);
  const [namespaces, setNamespaces] = useState([]);
  const namespace = useRef({ id: 1, name: '/', image: '/img/default.jpg' })
  const [rooms, setRooms] = useState([]);
  const room = useRef({ id: 1, name: 'RFP57', path: 'rfp57', image: '/img/default.jpg' });
  const [channels, setChannels] = useState([]);
  const channel = useRef({ id: null, name: null, room_id: null });

  const isPrivate = useRef(false);

  const messagesRef = useRef();
  const messageRef = useRef();

  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const onlineUsersRef = useRef([]);
  const [test, setTest] = useState();

  useEffect(() => {
    // setTest(some);
    const newSocket = io('http://localhost:3001', { autoConnect: false });
    setSocket(newSocket);

  }, [])

  useEffect(() => {
    if (socket) {

      socket.on('rooms', (rooms) => {
        console.log('rooms', rooms);
        setRooms(rooms);
      });

      socket.on('channels', (channels) => {
        console.log('channels', channels);
        setChannels(channels);
      });

      socket.on('namespaces', (namespaces) => {
        console.log('namespaces', namespaces);
        setNamespaces(namespaces);
      });

      socket.on('onlineUsers', (onlineUsers) => {
        console.log('online', onlineUsers);
        onlineUsersRef.current = onlineUsersRef.current.concat(onlineUsers);
        // setOnlineUsers(onlineUsers);
        setOnlineUsers((prevOnlineUsers) => {
          return prevOnlineUsers.concat(onlineUsers);
        });
      });

      socket.on('receiving', (received) => {
        history.current[received.room][received.channel] = history.current[received.room][received.channel] || [];
        history.current[received.room][received.channel].push(received);
        if (channel.current.name === received.channel) {
          const temp = history.current[received.room][received.channel].slice();
          setConversation(temp);
        }
      });

      socket.on('something', (username) => {
        const temp = onlineUsersRef.current;

        // console.log(onlineUsers);
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].username === username) {
            temp.splice(i, 1);
          }
        }
        // console.log('temp', temp);
        setOnlineUsers(temp);
      });

      // test.on('yay', (msg) => {
      //   console.log(msg);
      // })
      socket.auth = user;
      socket.connect();
      // test.connect();
    }
  }, [socket, user])

  useEffect(() => {
    messageRef.current.value = '';
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [conversation])

  const changeChannel = async (newChannel) => {
    isPrivate.current = false;
    channel.current = newChannel;
    if (history.current[room.current.path][channel.current.name]) {
      setConversation(history.current[room.current.path][channel.current.name]);
    } else {
      console.log('hello')
      const res = await axios.get('http://localhost:3000/api/messages', {
        params: {
          channelId: channel.current.id
        }
      });
      history.current[room.current.path][channel.current.name] = res.data;
      setConversation(res.data);
    }
  };

  const changeRoom = async (newRoom) => {
    console.log(newRoom);
    room.current = newRoom;
    if (history.current[room.current.path]) {
      console.log('hello');
    } else {
      const res = await axios.get('http://localhost:3000/api/channels', {
        params: {
          roomId: room.current.id
        }
      });
      if (res.data) {
        console.log('res', res.data);
        channel.current = res.data[0];
        history.current[room.current.path] = {};
        for (let i = 0; i < res.data.length; i++) {
          history.current[room.current.path][res.data[i].name] = null;
        }
        setChannels(res.data);
      } else {
        console.log('failed');
      }
    }
    // isPrivate.current = false;
    // if (history.current[room.current.namespace_id][room.current.name]) {
    //   setConversation(history.current[room.current.namespace_id][room.current.name]);
    // } else {
    //   const res = await axios.get('http://localhost:3000/api/messages', {
    //     params: {
    //       roomId: room.current.id
    //     }
    //   });
    //   history.current[room.current.namespace_id][room.current.name] = res.data;
    //   setConversation(res.data);
    // }
  };

  useEffect(() => {
    // for (let room of rooms) {
    //   if (!history.current[room.path]) {
    //     history.current[room.path] = {};
    //   }
    // }

    console.log('conversation', conversation);
  }, [conversation])

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

  const changeNamespace = (newNamespace) => {
    // namespace.current = newNamespace;
    // const temp = io(`http://localhost:3001${newNamespace.path}`);
    // setSocket(temp);
  };

  return (
    <div className={styles.chat}>
      <Rooms rooms={rooms} changeRoom={changeRoom} />
      <Channels channels={channels} channel={channel} changeChannel={changeChannel} room={room} />
      <div className={styles.main}>
        <div className={styles.bar}># {room.current.name}</div>
        <div className={styles.content}>
          <Conversation conversation={conversation} messagesRef={messagesRef} socket={socket} room={room} channel={channel} isPrivate={isPrivate} messageRef={messageRef} />
          <Users onlineUsers={onlineUsers} changePrivateRoom={changePrivateRoom} />
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