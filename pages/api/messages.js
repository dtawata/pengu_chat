import { getSession } from 'next-auth/react';
import { getUser, getJoinedRoom, getMessages } from '../../lib/db';

const Handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const email = session.user.email;
    const user = await getUser(email);
    const userId = user.id;
    const roomId = Number(req.query.roomId);
    const joinedRoom = await getJoinedRoom({ userId, roomId });
    const messages = await getMessages(joinedRoom.room_id);
    res.send(messages);
  } catch(error) {
    res.send(error);
  }
};

export default Handler;