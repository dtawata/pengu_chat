import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import Container from '../components/container/Container';

function MyApp({ Component, pageProps }) {

  return (
    <SessionProvider session={pageProps.session}>
      {/* <Container {...pageProps}> */}
        <Component {...pageProps} />
      {/* </Container> */}
    </SessionProvider>
  );
}

export default MyApp
