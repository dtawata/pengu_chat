import styles from './User.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const User = (props) => {
  const { user } = props;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.profile_container}>
          <Image className={styles.profile} src={user.image} alt={'profile'} width={45} height={45} />
        </div>
        <div className={styles.content}>
          <div className={styles.username}>test</div>
          <div className={styles.number}>#5556</div>
        </div>
      </div>
      <div className={styles.icons}>
        <FontAwesomeIcon icon={faPlus} className={styles.icon} flip='horizontal' />
        <FontAwesomeIcon icon={faPlus} className={styles.icon} flip='horizontal' />
        <FontAwesomeIcon icon={faPlus} className={styles.icon} flip='horizontal' />
      </div>
    </div>
  );
};

export default User;