import styles from './Container.module.css';
import Header from './Header';

const Container = (props) => {
  const { session } = props;

  return (
    <div className={styles.container}>
      <Header session={session} />
      {props.children}
    </div>
  );
}

export default Container;