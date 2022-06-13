import styles from './Modal.module.css';

const Modal = (props) => {
  const { toggleForm, addRoom, addChannel, modalRoomRef, modalChannelRef, modalFriendsRef,  modalForm, sendInvite } = props;

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div onClick={toggleForm} className={styles.close}>x</div>
        {modalForm.current === 'Friends' ? <div className={styles.title}>Send an Invite!</div> : <div className={styles.title}>Create a {modalForm.current}</div>}
        {modalForm.current === 'Room' &&
        <form onSubmit={addRoom} className={styles.form}>
          <input type='text' placeholder='Room Name' ref={modalRoomRef} />
          <button type='submit'>Create</button>
        </form>}
        {modalForm.current === 'Channel' &&
        <form onSubmit={addChannel} className={styles.form}>
          <input type='text' placeholder='Channel Name' ref={modalChannelRef} />
          <button type='submit'>Create</button>
        </form>}
        {modalForm.current === 'Friends' &&
        <form onSubmit={sendInvite} className={styles.form}>
          <input type='text' placeholder='Invite a Friend' ref={modalFriendsRef} />
        </form>
        }
      </div>
    </div>
  );
};

export default Modal;