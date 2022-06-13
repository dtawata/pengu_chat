import styles from '../styles/Home.module.css'
import Image from 'next/image';

const Home = (props) => {

  return (
    <div className={styles.container}>
    </div>
  );
};

export default Home;

export const getServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }
};