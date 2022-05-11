import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connection } from '../../../lib/db';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      async authorize(credentials) {
        try {
          const queryString = 'select * from users where email = ?';
          const queryArgs = [credentials.email];
          const data = await connection.promise().query(queryString, queryArgs);
          const user = data[0][0];
          if (user) {
            return {
              name: user.username,
              email: user.email
            }
          }
          return null;
        } catch(error) {
          return null;
        }
      }
    })
  ],
  secret: 'test',
  jwt: {
    secret: 'test',
    encryption: true
  },
  pages: {
    signIn: '/login'
  }
});