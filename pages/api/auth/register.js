import { connection } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

const handler = async (req, res) => {
  try {
    const { email, username, password, fname, lname } = req.body;
    const hashedPassword = await hashPassword(password);
    const queryString = 'insert into users (email, username, password, fname, lname) values ?';
    const queryArgs = [[[email, username, hashedPassword, fname, lname]]];
    const data = await connection.promise().query(queryString, queryArgs);
    console.log(data);
    res.send('success!');
  } catch(error) {
    // console.log(error);
    res.status(500).send(error);
  }
};

export default handler;