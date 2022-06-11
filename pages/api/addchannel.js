import { getUser, addChannel, addJoinedRoom } from '../../lib/db';
import { getSession } from 'next-auth/react';

const Handler = async (req, res) => {
  const session = await getSession({ req });
  const email = session.user.email;
  const user = await getUser(email);

  let { name, path, roomId } = req.body;
  const data = await addChannel({ name, path, roomId });
  res.send(data);
};

export default Handler;