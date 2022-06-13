import { getSession } from 'next-auth/react';
import { getUserId, addJoinedRoom } from '../../lib/db';

const Handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const { username, roomId } = req.body;
    const user = await getUserId(username);
    const userId = user.id;
    console.log(userId, roomId);
    const joinedRoom = await addJoinedRoom({ userId, roomId });
    res.send(userId);
  } catch(err) {
    res.status(401).send(err.message);
  }
};

export default Handler;