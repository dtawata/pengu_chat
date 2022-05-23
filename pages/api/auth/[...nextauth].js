import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connection } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      async authorize(credentials) {
        const queryString = 'select * from users where email = ?';
        const queryArgs = [credentials.email];
        const data = await connection.promise().query(queryString, queryArgs);
        const user = data[0][0];
        if (!user) {
          throw new Error('User not found!');
        }
        const validPassword = await verifyPassword(credentials.password, user.password);
        if (!validPassword) {
          throw new Error('Password is not valid!');
        }
        return {
          name: user.username,
          email: user.email,
          image: '/image'
        }
        // try {
        //   const queryString = 'select password from users where email = ?';
        //   const queryArgs = [credentials.email];
        //   const hashedPassword = await connection.promise().query(queryString, queryArgs);
        //   const verify = await verifyPassword(credentials.password, hashedPassword);
        //   console.log(verify);
        //   const user = data[0][0];
        //   if (user) {
            // return {
            //   name: user.username,
            //   email: user.email
            // }
        //   }
        //   return null;
        // } catch(error) {
        //   return null;
        // }
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