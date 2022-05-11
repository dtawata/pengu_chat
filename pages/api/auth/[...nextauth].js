import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      async authorize(credentials) {
        if (credentials.username === credentials.password) {
          return {
            name: 'Daniel',
            email: 'email@gmail.com'
          }
        }
        return null;
      }
    })
  ],
  secret: 'test',
  jwt: {
    secret: 'test',
    encryption: true
  },
  pages: {
    signIn: '/join/login.js'
  }
});