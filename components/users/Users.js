import styles from './Users.module.css';
import Image from 'next/image';

const Users = (props) => {
  const { onlineUsers, users, changePrivateRoom } = props;

  return (
    <div className={styles.users}>
      <div className={styles.title}>ONLINE - {onlineUsers.length}</div>
      {onlineUsers.map((onlineUser) => {
        return <OnlineUser onlineUser={onlineUser} changePrivateRoom={changePrivateRoom} key={onlineUser.id} />
      })}
      <div className={styles.title}>OFFLINE - {users.length}</div>
      <div>
        {users.map((user) => {
          return <User user={user} key={user.id} />
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

const User = (props) => {
  const { user } = props;
  return (
    <div onClick={() => { }} className={styles.online_user}>
      <Image src={user.image} className={styles.image} alt='' width='30' height='30' />
      <div className={styles.name}>{user.username}</div>
    </div>
  );
};

export default Users;