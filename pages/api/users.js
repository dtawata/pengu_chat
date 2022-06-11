import { getSession } from 'next-auth/react';
import { getUser, getJoinedRoom, getUsers } from '../../lib/db';

const Handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const email = session.user.email;
    const user = await getUser(email);
    const userId = user.id;
    const { roomId } = req.query;
    const joinedRoom = await getJoinedRoom({ userId, roomId });
    if (!joinedRoom) {
      throw new Error('Not authorized');
    }
    const users = await getUsers(roomId);
    res.send(users);
  } catch(err) {
    res.status(401).send(err.message);
  }
};

export default Handler;