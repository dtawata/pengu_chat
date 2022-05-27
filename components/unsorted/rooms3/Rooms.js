import styles from './Rooms.module.css';

const Rooms = (props) => {
  const { rooms, changeRoom } = props;

  return (
    <div className={styles.rooms}>
      <div className={styles.title}>Rooms</div>
      {rooms.map((room) => {
        return <Room room={room} changeRoom={changeRoom} key={room.id} />;
      })}
    </div>
  );
};

const Room = (props) => {
  const { room, changeRoom } = props;

  return (
    <div onClick={() => { changeRoom(room) }} className={styles.room}>{room.name}</div>
  );
};

export default Rooms;