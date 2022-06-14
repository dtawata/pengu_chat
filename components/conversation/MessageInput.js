import styles from './MessageInput.module.css';

const MessageInput = (props) => {
  const { socket, room, channel, isPrivate, messageRef } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = messageRef.current.value;
    if (isPrivate.current) {
      socket.emit('sending_private', { message, room: room.current });
    } else {
      socket.emit('sending', { message, room: room.current, channel: channel.current });
    }
  };

  return (
    <div className={styles.message_input}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input className={styles.form_input} type='text' placeholder='Message...' ref={messageRef} />
      </form>
    </div>
  );
};

export default MessageInput;