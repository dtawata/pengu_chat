import { getUser, addRoom, addJoinedRoom } from '../../lib/db';
import { getSession } from 'next-auth/react';

const Handler = async (req, res) => {
  const session = await getSession({ req });
  const email = session.user.email;
  const user = await getUser(email);
  const userId = user.id;
  let { roomId } = req.body;
  const data = await addJoinedRoom({ userId, roomId });
  res.send(data);
};

export default Handler;