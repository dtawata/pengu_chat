import styles from '../styles/Home.module.css'
import Messages from '../components/Messages';
import MessageInput from '../components/MessageInput';

const Home = (props) => {
  const { messages } = props;
  return (
    <div className={styles.container}>
      <div className={styles.namespaces}>

      </div>
      <div className={styles.rooms}>
        <div className={styles.room}>general</div>
        <div className={styles.room}>general</div>
        <div className={styles.room}>general</div>
      </div>
      <div className={styles.main}>
        <Messages messages={messages} />
        <MessageInput />
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = () => {
  return {
    props: {
      messages: ['hello!', 'second']
    }
  }
};
