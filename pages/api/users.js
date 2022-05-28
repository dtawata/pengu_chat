import { getSession } from 'next-auth/react';
import { getUsers } from '../../lib/db';

const Handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const email = session.user.email;
    const roomId = req.query.roomId;
    const users = await getUsers(roomId);
    res.send(users);
  } catch(error) {
    res.send(error);
  }
};

export default Handler;