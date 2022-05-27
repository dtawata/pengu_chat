import styles from './Conversation.module.css';
import Messages from './Messages';
import MessageInput from './MessageInput';

const Conversation = (props) => {
  const { conversation, messagesRef, socket, room, isPrivate, messageRef } = props;

  return (
    <div className={styles.conversation}>
      <Messages conversation={conversation} messagesRef={messagesRef} />
      <MessageInput socket={socket} room={room} isPrivate={isPrivate} messageRef={messageRef} />
    </div>
  );
};

export default Conversation;