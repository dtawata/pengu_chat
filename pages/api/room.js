import { getSession } from 'next-auth/react';
import { getUser, getRoom } from '../../lib/db';

const Handler = async (req, res) => {
  const session = await getSession({ req });
  const email = session.user.email;
  const user = await getUser(email);
  const { roomId } = req.body;
  console.log('roomid', roomId);
  const room = await getRoom(roomId);
  console.log('!!!', room);
  res.send(room);
};

export default Handler;