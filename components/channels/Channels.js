import styles from './Channels.module.css'
import { Fragment } from 'react';
import User from './User';

const Channels = (props) => {
  const { channels, channel, room, user, changeChannel } = props;
  const selected = channel.current ? channel.current.name : null;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{room.current.name}</div>
      <div className={styles.content}>
        <div className={styles.channels}>
          {channels.map((channel) => {
            return <Channel channel={channel} changeChannel={changeChannel} selected={selected} key={channel.id} />;
          })}
        </div>
        <User user={user} />
      </div>
      {/* <div onClick={() => { showForm('channel'); }}>Add Channel</div> */}
    </div>
  );
};

const Channel = (props) => {
  const { channel, changeChannel, selected } = props;

  return (
    <Fragment>
      {selected === channel.name ?
        <div onClick={() => { changeChannel(channel); }} className={`${styles.channel} ${styles.active}`}># {channel.name}</div> :
        <div onClick={() => { changeChannel(channel); }} className={styles.channel}># {channel.name}</div>
      }
    </Fragment>
  );
};

export default Channels;