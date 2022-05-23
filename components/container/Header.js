import styles from './Header.module.css';
import { signOut } from 'next-auth/react';

const Header = (props) => {
  const { session } = props;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Penguin Chat</div>
      {session &&
      <nav className={styles.nav}>
        <ul>
          <li>Rooms</li>
          <li>Friends</li>
          <li>Third</li>
          <li>Fourth</li>
        </ul>
      </nav>}
      {session &&
      <div className={styles.utility}>
        <div onClick={signOut}>Sign Out</div>
      </div>}
    </header>
  );
};

export default Header;