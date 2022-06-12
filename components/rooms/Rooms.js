import styles from './Rooms.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Rooms = (props) => {
  const { rooms, changeRoom, toggleForm } = props;

  return (
    <div className={styles.container}>
      <div className={styles.rooms}>
        {rooms.map((room) => {
          return <Room room={room} changeRoom={changeRoom} key={room.id} />
        })}
      </div>
      <div onClick={() => { toggleForm('Room'); }} className={styles.icon_container}>
        <FontAwesomeIcon icon={faPlus} className={styles.icon} flip='horizontal' />
      </div>
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