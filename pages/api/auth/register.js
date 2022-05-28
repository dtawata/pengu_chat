import { addUser, addJoinedRoom } from '../../../lib/db';

const Handler = async (req, res) => {
  try {
    const attempt = await addUser(req.body);
    const attempt3 = await addJoinedRoom({
      user_id: attempt.insertId,
      room_id: 1
    });
    const attempt4 = await addJoinedRoom({
      user_id: attempt.insertId,
      room_id: 2
    });
    res.send('success!');
  } catch(error) {
    res.status(500).send(error);
  }
};

export default Handler;