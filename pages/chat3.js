import styles from '../styles/Chat.module.css';
import { useState, useRef, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { io } from 'socket.io-client'; // got it
import axios from 'axios'; // got it
import { getUser } from '../lib/db';
import Conversation from '../components/conversation/Conversation';
import Rooms from '../components/rooms/Rooms';
import Users from '../components/users/Users';

const Chat = (props) => {
  const { session, user } = props; // got it
  const history = useRef({}); // got it
  const [conversation, setConversation] = useState([]); // got it
  const [socket, setSocket] = useState(null); // got it
  const [rooms, setRooms] = useState([]); // got it
  const room = useRef({ id: 1, name: 'lobby' }); // got it
  const isPrivate = useRef(false); // got it
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const onlineUsersRef = useRef([]);
  const messagesRef = useRef(); // got it
  const messageRef = useRef(); // got it
  const [counter, setCounter] = useState(200);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', { autoConnect: false });
    setSocket(newSocket);
  }, [])

  useEffect(() => {
    if (socket) {

      socket.on('rooms', (rooms) => {
        setRooms(rooms);
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
        history.current[received.room] = history.current[received.room] || [];
        history.current[received.room].push(received);
        if (room.current.name === received.room) {
          const temp = history.current[received.room].slice();
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

      socket.auth = user;
      socket.connect();
    }
  }, [socket, user])

  useEffect(() => {
    messageRef.current.value = '';
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [conversation])

  const amazing = () => {
    console.log('online!', conversation);
  }

  const changeRoom = async (newRoom) => {
    isPrivate.current = false;
    room.current.id = newRoom.id;
    room.current.name = newRoom.name;
    if (history.current[room.current.name]) {
      setConversation(history.current[room.current.name]);
    } else {
      const res = await axios.get('http://localhost:3000/api/messages', {
        params: {
          roomId: room.current.id
        }
      });
      history.current[room.current.name] = res.data;
      setConversation(res.data);
    }
  };

  const changePrivateRoom = async (newUser) => {
    isPrivate.current = true;
    room.current.id = newUser.id;
    room.current.name = newUser.username;
    if (history.current[room.current.name]) {
      setConversation(history.current[room.current.name]);
    } else {
      const res = await axios.get('http://localhost:3000/api/personal', {
        params: {
          to: room.current.id
        }
      });
      history.current[room.current.name] = res.data;
      setConversation(res.data);
    }
  };

  useEffect(() => {
    console.log('cool', counter);
  }, [counter])

  const test = () => {
    setCounter(2);
  };

  return (
    <div className={styles.chat}>
      <div onClick={test}>Test</div>
      <Rooms rooms={rooms} changeRoom={changeRoom} />
      <Conversation conversation={conversation} socket={socket} room={room} isPrivate={isPrivate} messagesRef={messagesRef} messageRef={messageRef} />
      <Users onlineUsers={onlineUsers} changePrivateRoom={changePrivateRoom} />
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