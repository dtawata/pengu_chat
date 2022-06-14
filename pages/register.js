import styles from '../styles/register.module.css';
import { useRef } from 'react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import axios from 'axios';

const Register = (props) => {
  const emailRef = useRef();
  const usernameRef = useRef();
  const fnameRef = useRef();
  const lnameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const email = emailRef.current.value;
      const username = usernameRef.current.value;
      const personal = usernameRef.current.value;
      const fname = fnameRef.current.value;
      const lname = lnameRef.current.value;
      const password = passwordRef.current.value;
      const user = { email, username, password, fname, lname, personal };
      const res = await axios.post('/api/auth/register', user);
      signIn('credentials', { email, password });
    } catch(error) {
      console.log('error', error.response.data.message);
    }
  };

  return (
    <div className={styles.register}>
      <h2 className={styles.title}>Create an account</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type='email' placeholder='Email' ref={emailRef} required />
        <input type='text' placeholder='Username' ref={usernameRef} required />
        <input type='text' placeholder='First Name' ref={fnameRef} required />
        <input type='text' placeholder='Last Name' ref={lnameRef} required />
        <input type='password' placeholder='Password' ref={passwordRef} required />
        <button className={styles.button} type='submit'>Sign Up</button>
      </form>
      <div className={styles.login}>Already have an account? <Link href='/login' passHref><span>Log In</span></Link></div>
    </div>
  );
};

export default Register;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: '/chat',
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
};