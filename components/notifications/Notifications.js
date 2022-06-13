import styles from './Notifications.module.css';
import { useState, Fragment } from 'react';

const Notifications = (props) => {
  const { notifications, showNotifications, updateNotification } = props;

  return (
    <div className={styles.container}>
      <div className={styles.notifications}>
        <div onClick={showNotifications} className={styles.close}>x</div>
        <div className={styles.title}>Notifications ({notifications.length})</div>
        {notifications.map((notification, index) => {
          return <Notification notification={notification} key={notification.id} updateNotification={updateNotification} />
        })}
      </div>
    </div>
  );
};

const Notification = (props) => {
  const { notification, updateNotification } = props;
  const [responded, setResponded] = useState(false);

  return (
    <Fragment>
      {responded ? <div>hello</div> : <div className={styles.notification}>
        <div>You&apos;re invited to join <span>{notification.room}</span> by {notification.username}.</div>
        <div className={styles.buttons}>
          <button onClick={() => { updateNotification(notification, 'accept'); setResponded(true); }} className={styles.button}>Accept</button>
          <button onClick={() => { updateNotification(notification, 'dismiss');  setResponded(true); }} className={styles.button}>Dismiss</button>
        </div>
      </div>}
    </Fragment>
  );
};

export default Notifications;