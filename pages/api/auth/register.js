import { addUser, addJoinedRoom } from '../../../lib/db';

const Handler = async (req, res) => {
  try {
    const attempt = await addUser(req.body);
    const attempt3 = await addJoinedRoom({
      userId: attempt.insertId,
      roomId: 1
    });
    const attempt4 = await addJoinedRoom({
      userId: attempt.insertId,
      roomId: 2
    });
    res.send('success!');
  } catch(error) {
    res.status(500).send(error);
  }
};

export default Handler;