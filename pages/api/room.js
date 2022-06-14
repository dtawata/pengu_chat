import { getSession } from 'next-auth/react';
import { getUser, getRoom } from '../../lib/db';

const Handler = async (req, res) => {
  const session = await getSession({ req });
  const email = session.user.email;
  const user = await getUser(email);
  const { roomId } = req.body;
  const room = await getRoom(roomId);
  res.send(room);
};

export default Handler;