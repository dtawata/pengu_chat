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
import Modal from '../components/modal/Modal';
import Notifications from '../components/notifications/Notifications';

const Chat = (props) => {
  const { session, user } = props;
  const [socket, setSocket] = useState(null);
  const [conversation, setConversation] = useState([]);
  const history = useRef({});
  const [rooms, setRooms] = useState([]);
  const roomsRef = useRef([]);
  const room = useRef({});
  const [channels, setChannels] = useState([]);
  const channel = useRef({});
  const [users, setUsers] = useState([]);
  const ref = useRef({});
  const isPrivate = useRef(false);
  const messagesRef = useRef();
  const messageRef = useRef();
  const [modal, setModal] = useState(false);
  const modalRoomRef = useRef();
  const modalChannelRef = useRef();
  const modalForm = useRef('Room');
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const modalFriendsRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef([]);

  useEffect(() => {
    const newSocket = io('https://young-mesa-16987.herokuapp.com/', { autoConnect: false });
    setSocket(newSocket);
  }, [])

  useEffect(() => {
    if (socket) {

      socket.on('message', (msg) => {
        console.log('test', msg);
      });

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
        roomsRef.current = rooms;
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

        const notifications = await axios.get('/api/notifications');
        notificationsRef.current = notifications.data;
        setNotifications(notifications.data);
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

      socket.on('addRoom', (data) => {
        roomsRef.current = roomsRef.current.concat([data.room]);
        history.current[data.room.path] = {};
        ref.current[data.room.path] = { channels: [], users: {} };
        for (let channel of data.channels) {
          history.current[channel.room][channel.path] = null;
          ref.current[channel.room].channels.push(channel);
        }
        room.current = data.room;
        channel.current = ref.current[room.current.path].channels[0];
        setRooms(roomsRef.current);
        setChannels(ref.current[room.current.path].channels);
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

      socket.on('invitedNewUser', (user) => {
        ref.current[room.current.path].users[user.username] = user;
        ref.current[room.current.path].users[user.username].online = false;
        setUsers(Object.values(ref.current[room.current.path].users));
        socket.emit('getOnlineUsersAgain', room.current);
      });

      socket.on('receive_invite', (notification) => {
        notificationsRef.current.push(notification);
        setNotifications(notificationsRef.current);
      });

      socket.on('reInitializeOnlineUsers', (onlineUsers) => {
        // for (let onlineUser of onlineUsers) {
        //   ref.current[room.current.path].users[onlineUser].online = true;
        // }
        // setUsers(Object.values(ref.current[room.current.path].users));
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

  const toggleForm = (typeOfForm) => {
    modalForm.current = typeOfForm;
    setModal((prevModal) => {
      return !prevModal;;
    });
  };

  const sendInvite = async (e) => {
    e.preventDefault();
    // const temp = { username: modalFriendsRef.current.value, roomId: room.current.id };
    // const res = await axios.post('/api/invite', temp);
    // const newUserId = res.data;
    // socket.emit('invited', { username: modalFriendsRef.current.value, userId: newUserId, room: room.current.path });
    socket.emit('send_invite', { from: user.id, toUsername: modalFriendsRef.current.value, room: room.current.id });
    // setUsers(Object.values(ref.current[room.current.path].users));
    // socket.emit('getOnlineUsers', room.current);

    setModal((prevState) => {
      return !prevState;
    });
  };

  const addRoom = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/addroom/', {
      name: modalRoomRef.current.value,
      path: modalRoomRef.current.value.toLowerCase(),
      image: null
    });
    socket.emit('join_room', res.data.insertId);
    setConversation([]);
    setModal((prevState) => {
      return !prevState;
    });
  };

  const addChannel = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/addchannel/', {
      name: modalChannelRef.current.value,
      path: modalChannelRef.current.value.toLowerCase(),
      roomId: room.current.id
    });
    const temp = {
      id: res.data.insertId,
      name: modalChannelRef.current.value,
      path: modalChannelRef.current.value.toLowerCase(),
      room_id: room.current.id,
      room: room.current.path
    };
    channel.current = temp;
    history.current[temp.room][temp.path] = [];
    ref.current[temp.room].channels.push(temp);
    setChannels(ref.current[room.current.path].channels);
    setConversation([]);
    setModal((prevState) => {
      return !prevState;
    });
  };

  const showNotifications = async () => {
    const notifications = await axios.get('/api/notifications');
    notificationsRef.current = notifications.data;
    setNotifications(notifications.data);
    setDisplayNotifications((prevDisplayNotifications) => {
      return !prevDisplayNotifications;
    });
  };

  useEffect(() => {
    messageRef.current.value = '';
    // messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [conversation])

  const updateNotification = async (notification, response) => {
    const res = await axios.post('/api/update-notification', { notificationId: notification.id });
    if (response === 'accept') {
      const res = await axios.post('/api/join-room', { roomId: notification.room_id });
      const room = await axios.post('/api/room', { roomId: notification.room_id });
      history.current[room.data.path] = {};
      ref.current[room.data.path] = { channels: [], users: {} };
      setRooms((prevRooms) => {
        return prevRooms.concat([room.data]);
      });
    }
  };

  return (
    <div className={styles.chat}>
      <Rooms rooms={rooms} changeRoom={changeRoom} toggleForm={toggleForm} />
      <Channels channels={channels} channel={channel} room={room} user={user} toggleForm={toggleForm} changeChannel={changeChannel} showNotifications={showNotifications} />
      <main className={styles.main}>
        <div className={styles.bar}># {channel.current ? channel.current.name : null }</div>
        <div className={styles.content}>
          <Conversation conversation={conversation} socket={socket} room={room} channel={channel} messageRef={messageRef} isPrivate={isPrivate} messagesRef={messagesRef} />
          <Users users={users} />
        </div>
      </main>
      {modal && <Modal toggleForm={toggleForm} addRoom={addRoom} addChannel={addChannel} modalRoomRef={modalRoomRef} modalChannelRef={modalChannelRef} modalFriendsRef={modalFriendsRef} modalForm={modalForm} sendInvite={sendInvite} />}
      {displayNotifications && <Notifications notifications={notifications} showNotifications={showNotifications} updateNotification={updateNotification} />}
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

  // })

  // socket.on('receiving', (data) => {
  //   history.current[data.room][data.channel] = history.current[data.room][data.channel] || [];
  //   history.current[data.room][data.channel].push(data);
  //   if (channel.current.name === data.channel) {
  //     const temp = history.current[data.room][data.channel].slice();
  //     setConversation(temp);
  //   }
  // });





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

