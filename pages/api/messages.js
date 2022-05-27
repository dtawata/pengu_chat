import { getSession } from 'next-auth/react';
import { getUser, getJoinedRoom, getMessages, checkNamespace } from '../../lib/db';

const Handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const email = session.user.email;
    const user = await getUser(email);
    const userId = user.id;
    // const roomId = Number(req.query.roomId);
    const channelId = Number(req.query.channelId);
    // is this user in the namespace that has the room
    // const check = await checkNamespace(userId, roomId);
    // const joinedRoom = await getJoinedRoom({ userId, roomId });
    const messages = await getMessages(channelId);
    res.send(messages);
  } catch(error) {
    res.send(error);
  }
};

export default Handler;