import styles from './Modal.module.css';

const Modal = ({ toggleForm, addRoom, addChannel, modalRoomRef, modalChannelRef, modalForm }) => {

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div onClick={toggleForm} className={styles.close}>x</div>
        <div className={styles.title}>Create a {modalForm.current}</div>
        {modalForm.current === 'Room' ?
        <form onSubmit={addRoom} className={styles.form}>
          <input type='text' placeholder='Room Name' ref={modalRoomRef} />
          <button type='submit'>Create</button>
        </form> :
        <form onSubmit={addChannel} className={styles.form}>
          <input type='text' placeholder='Channel Name' ref={modalChannelRef} />
          <button type='submit'>Create</button>
        </form>}
      </div>
    </div>
  );
};

export default Modal;