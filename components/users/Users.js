import styles from './Users.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Users = (props) => {
  const { users } = props;

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);

  useEffect(() => {
    const tempOnlineUsers = [];
    const tempOfflineUsers = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.online) {
        tempOnlineUsers.push(user);
      } else {
        tempOfflineUsers.push(user);
      }
    }
    setOnlineUsers(tempOnlineUsers);
    setOfflineUsers(tempOfflineUsers);
  }, [users])

  return (
    <div className={styles.container}>
      <div className={styles.title}>ONLINE - {onlineUsers.length}</div>
        {onlineUsers.map((onlineUser) => {
          return <OnlineUser onlineUser={onlineUser} key={onlineUser.id} />
        })}
      <div className={styles.title}>OFFLINE - {offlineUsers.length}</div>
      <div>
        {offlineUsers.map((offlineUser) => {
          return <OfflineUser offlineUser={offlineUser} key={Math.random().toFixed(3)} />
        })}
      </div>
    </div>
  );
};

const OnlineUser = (props) => {
  const { onlineUser, changePrivateRoom } = props;
  return (
    <div onClick={() => { changePrivateRoom(onlineUser) }} className={styles.online_user}>
      <Image src={onlineUser.image} className={styles.image} alt='' width='30' height='30' />
      <div className={styles.name}>{onlineUser.username}</div>
    </div>
  );
};

const OfflineUser = (props) => {
  const { offlineUser } = props;

  return (
    <div onClick={() => { }} className={styles.online_user}>
      <Image src={offlineUser.image} className={styles.image} alt='' width='30' height='30' />
      <div className={styles.name}>{offlineUser.username}</div>
    </div>
  );
};

export default Users;


// import styles from './Users.module.css';
// import Image from 'next/image';
// import { useState, useEffect } from 'react';

// const Users = (props) => {
//   const { testUsers, changePrivateRoom } = props;

//   return (
    // <div className={styles.users}>
    //   <div className={styles.title}>ONLINE - {onlineUsers.length}</div>
    //   {onlineUsers.map((onlineUser) => {
    //     return <OnlineUser onlineUser={onlineUser} changePrivateRoom={changePrivateRoom} key={onlineUser.id} />
    //   })}
    //   <div className={styles.title}>OFFLINE - {offlineUsers.length}</div>
    //   <div>
    //     {offlineUsers.map((offlineUser) => {
    //       return <OfflineUser offlineUser={offlineUser} key={Math.random().toFixed(3)} />
    //     })}
    //   </div>
    // </div>
//   );
// };