import styles from './Users.module.css';
import Image from 'next/image';

const Users = (props) => {
  const { onlineUsers, changePrivateRoom } = props;

  return (
    <div className={styles.users}>
      <div className={styles.title}>Online Users - {onlineUsers.length}</div>
      {onlineUsers.map((onlineUser) => {
        return <OnlineUser onlineUser={onlineUser} changePrivateRoom={changePrivateRoom} key={onlineUser.id} />
      })}
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

export default Users;