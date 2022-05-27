import styles from './Rooms.module.css';
import Image from 'next/image';

const Rooms = (props) => {
  const { rooms, changeRoom } = props;

  return (
    <div className={styles.namespaces}>
      {rooms.map((room) => {
        return <Room room={room} changeRoom={changeRoom} key={room.id} />
      })}
    </div>
  );
};

const Room = (props) => {
  const { room, changeRoom } = props;

  return (
    <div onClick={() => { changeRoom(room); }} className={styles.profile_container}>
      <Image className={styles.profile} src={room.image} alt='' width='65' height='65' />
    </div>
  );
};

export default Rooms;