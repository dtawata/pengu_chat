import { getSession } from 'next-auth/react';
import { getUser, getPersonalMessages, getMessages } from '../../lib/db';

const Handler = async (req, res) => {
  const session = await getSession({ req });
  const email = session.user.email;
  const user = await getUser(email);
  const userId = user.id;
  const toId = Number(req.query.to);
  // const roomId = Number(req.query.roomId);
  // const joinedRoom = await getJoinedRoom({ userId, roomId });
  const personal = await getPersonalMessages({ from: userId, to: toId });
  res.send(personal);
};

export default Handler;