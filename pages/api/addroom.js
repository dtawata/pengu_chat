import { getUser, addRoom, addJoinedRoom } from '../../lib/db';
import { getSession } from 'next-auth/react';

const Handler = async (req, res) => {
  const session = await getSession({ req });
  const email = session.user.email;
  const user = await getUser(email);
  console.log(req.body);
  let { name, path, image } = req.body;
  if (!image) {
    image = '/img/default.jpg';
  }
  const data = await addRoom({ name, path, image });
  console.log(data.insertId);
  const wait = await addJoinedRoom({ userId: user.id, roomId: data.insertId});
  res.send(data);
};

export default Handler;