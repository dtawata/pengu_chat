import styles from '../styles/Home.module.css'
import Image from 'next/image';

const Home = (props) => {
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.history}>
          <div className={styles.message}>
            <Image className={styles.profile} src='/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg' alt='' width='50' height='50' />
            <div className={styles.content}>
              <div className={styles.message_header}>
                <div className={styles.message_header_username}>username</div>
                <div className={styles.message_header_date}>Today at 1:13 PM</div>
              </div>
              <div className={styles.message_content}>penguins are the best</div>
            </div>
          </div>
        </div>
        <div className={styles.input}>
          <form className={styles.form}>
            <input className={styles.form_input} type='text' placeholder='Message...' />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
