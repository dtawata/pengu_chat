import styles from './Messages.module.css';
import Image from 'next/image';

const Messages = (props) => {
  const { messages } = props;

  return (
    <div className={styles.messages}>
      {messages.map((message, index) => {
        return <Message key={index} message={message} />
      })}
    </div>
  );
};

const Message = (props) => {
  return (
    <div className={styles.message}>
      <div className={styles.profile_container}>
        <Image className={styles.profile} src='/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg' alt='' width='50' height='50' />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.header_username}>username</div>
          <div className={styles.header_date}>Today at 1:13 PM</div>
        </div>
        <div className={styles.text}>penguins are the best</div>
      </div>
    </div>
  );
};

export default Messages;