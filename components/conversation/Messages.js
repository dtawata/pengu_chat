import styles from './Messages.module.css';
import Image from 'next/image';
import { DateTime } from 'luxon';

// if message is from the same user and the time is only 1 minute apart then return something else

const Messages = (props) => {
  const { conversation, messagesRef } = props;
  let user = null;
  let date_time = null;

  return (
    <div className={styles.container} ref={messagesRef}>
      {conversation.map((message) => {
        if (!date_time) {
          user = message.username;
          date_time = DateTime.fromISO(message.created_at);
          return <Message message={message} key={message.id} />
        }
        const seconds = DateTime.fromISO(message.created_at).diff(date_time, ['seconds']).toObject().seconds;
        if (user === message.username && seconds < 240) {
          return <MessageAlt message={message} key={message.id} />
        } else {
          user = message.username;
          date_time = DateTime.fromISO(message.created_at);
          return <Message message={message} key={message.id} />
        }
      })}
    </div>
  );
};

const Message = (props) => {
  const { message } = props;
  // DateTime.fromISO('2022-05-28T01:23:22.000Z').toFormat('yyyy LLL dd')
  return (
    <div className={styles.message}>
      <div className={styles.profile_container}>
        <Image className={styles.profile} src={message.image} alt='' width='55' height='55' />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.header_username}>{message.username}</div>
          <div className={styles.header_date}>{DateTime.fromISO(message.created_at).toFormat('ff')}</div>
        </div>
        <div className={styles.text}>{message.content}</div>
      </div>
    </div>
  );
};

const MessageAlt = (props) => {
  const { message } = props;

  return (
    <div className={styles.message_alt}>
      <div className={styles.profile_container}>
        <div className={styles.date_time}>{DateTime.fromISO(message.created_at).toLocaleString(DateTime.TIME_SIMPLE)}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.text}>{message.content}</div>
      </div>
    </div>
  );
};

export default Messages;


// date = DateTime.fromISO(message.created_at).toLocaleString();
// time = DateTime.fromISO(message.created_at).toLocaleString(DateTime.TIME_SIMPLE);
