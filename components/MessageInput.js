
import styles from './MessageInput.module.css';
import { useRef } from 'react';

const MessageInput = (props) => {
  const messageInput = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(messageInput.current.value);
  };

  return (
    <div className={styles.input}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input className={styles.form_input} type='text' placeholder='Message...' ref={messageInput} />
      </form>
    </div>
  );
};

export default MessageInput;