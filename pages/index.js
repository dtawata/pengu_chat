import styles from '../styles/Home.module.css'
import Image from 'next/image';

const Home = (props) => {

  return (
    <div className={styles.container}>
      <div className={styles.namespaces}>
        <div className={styles.profile_container}>
          <Image className={styles.profile} src='/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg' alt='' width='65' height='65' />
        </div>
        <div className={styles.profile_container}>
          <Image className={styles.profile} src='/img/a0014568137_10.jpg' alt='' width='65' height='65' />
        </div>
        <div className={styles.profile_container}>
          <Image className={styles.profile} src='/img/idealism.jpg' alt='' width='65' height='65' />
        </div>
        <div className={styles.profile_container}>
          <Image className={styles.profile} src='/img/images.jpg' alt='' width='65' height='65' />
        </div>
      </div>
      <div className={styles.group}>
        <div className={styles.group_title}>RFP57 HR</div>
        <ul className={styles.rooms}>
          <li className={styles.active}># general</li>
          <li># resources</li>
          <li># music</li>
          <li># toy-problems</li>
        </ul>
      </div>
      <div className={styles.right}>
        <div className={styles.bar}># general</div>
        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.history}></div>
            <div className={styles.messageInput}></div>
          </div>
          <div className={styles.online}></div>
        </div>
      </div>
    </div>
  );
};

export default Home;