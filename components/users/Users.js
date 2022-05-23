import styles from './Users.module.css';

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
    <div onClick={() => { changePrivateRoom(onlineUser) }} className={styles.online_user}>{onlineUser.username}</div>
  );
};

export default Users;