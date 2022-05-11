import { useState, useRef } from 'react';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import styles from './login.module.css';

const Login = (props) => {
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const user = { username, password };
    signIn('credentials', user);
  };

  return (
    <div className={styles.login}>
      {/* <div>{props.session ? props.session.user.email : 'Not logged in'}</div> */}
      {/* <div onClick={signOut}>SignOut</div> */}
      <h2 className={styles.title}>Create an account</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type='email' placeholder='Email' ref={usernameRef} />
        <input type='text' placeholder='Username' ref={usernameRef} />
        <input type='text' placeholder='First Name' ref={passwordRef} />
        <input type='text' placeholder='Last Name' ref={passwordRef} />
        <input type='password' placeholder='Password' ref={passwordRef} />
        <button className={styles.button} type='submit'>Sign Up</button>
      </form>
      <div className={styles.already}>Already have an account? <span>Log In</span></div>
    </div>
  );
};

export default Login;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session
    }
  }
};