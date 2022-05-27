import { getSession } from 'next-auth/react';
import { getUser, getJoinedRoom, getChannels } from '../../lib/db';

const Handler = async (req, res) => {
  const session = await getSession({ req });
  const email = session.user.email;
  const user = await getUser(email);
  const userId = user.id;
  const roomId = Number(req.query.roomId);
  const hasAccess = await getJoinedRoom({ userId, roomId });
  console.log('has', hasAccess)
  if (hasAccess) {
    const channels = await getChannels(roomId);
    res.send(channels);
  } else {
    res.send(hasAccess);
  }
};

export default Handler;