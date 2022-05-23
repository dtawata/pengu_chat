import { addUser, addRoom, addJoinedRoom } from '../../../lib/db';


const Handler = async (req, res) => {
  try {
    const attempt = await addUser(req.body);
    const attempt2 = await addRoom({ name: req.body.username, namespace_id: 1 });
    // const attempt3 = await addJoinedRoom({
    //   user_id: attempt.insertId,
    //   room_id: attempt2.insertId
    // });
    const attempt4 = await addJoinedRoom({
      user_id: attempt.insertId,
      room_id: 1
    });
    res.send('success!');
  } catch(error) {
    res.status(500).send(error);
  }
};

export default Handler;