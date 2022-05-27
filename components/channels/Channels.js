import styles from './Channels.module.css';

const Channels = (props) => {
  const { channels, channel, changeChannel, room } = props;
  const selected = channel.current.name;

  return (
    <div className={styles.group}>
      <div className={styles.group_title}>{room.current.name}</div>
      <ul className={styles.rooms}>
        {channels.map((channel) => {
          return <Channel channel={channel} changeChannel={changeChannel} selected={selected} key={channel.id} />;
        })}
      </ul>
    </div>
  );
};

const Channel = (props) => {
  const { channel, changeChannel, selected } = props;

  return (

    // <li onClick={() => {  }}># {channel.name}</li>

    <div>
      {selected === channel.name ?
        <li onClick={() => { changeChannel(channel); }} className={styles.active}># {channel.name}</li> :
        <li onClick={() => { changeChannel(channel); }}># {channel.name}</li>
      }
    </div>
  );
};

export default Channels;