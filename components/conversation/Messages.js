import styles from './Messages.module.css';
import Image from 'next/image';

const Messages = (props) => {
  const { conversation, messagesRef } = props;

  return (
    <div className={styles.messages} ref={messagesRef}>
      {conversation.map((message) => {
        return <Message message={message} key={message.id} />
      })}
    </div>
  );
};

const Message = (props) => {
  const { message } = props;

  return (
    <div className={styles.message}>
      <div className={styles.profile_container}>
        <Image className={styles.profile} src={message.image} alt='' width='50' height='50' />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.header_username}>{message.username}</div>
          <div className={styles.header_date}>{message.created_at}</div>
        </div>
        <div className={styles.text}>{message.content}</div>
      </div>
    </div>
  );
};

export default Messages;