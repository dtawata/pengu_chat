import styles from '../styles/login.module.css';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import router from 'next/router';

const Login = (props) => {
  const [loginError, setLoginError] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const user = { redirect: false, email, password };
    const result = await signIn('credentials', user);
    if (!result.error) {
      router.replace('/chat');
    } else {
      (result.error);
      setLoginError(result.error);
    }
  };

  return (
    <div className={styles.login}>
      <h2 className={styles.title}>Welcome back!</h2>
      {loginError && <div className={styles.login_error}>{loginError}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type='email' placeholder='Email' ref={emailRef} required />
        <input type='password' placeholder='Password' ref={passwordRef} required />
        <button className={styles.button} type='submit'>Log In</button>
      </form>
      <div className={styles.register}>Need an account? <Link href='/register' passHref><span>Register</span></Link></div>
    </div>
  );
};

export default Login;

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