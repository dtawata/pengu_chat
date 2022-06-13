import { getSession } from 'next-auth/react';
import { getUser, updateNotification } from '../../lib/db';

const Handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const email = session.user.email;
    const user = await getUser(email);
    const { notificationId } = req.body;
    console.log(notificationId)
    const update = await updateNotification(notificationId);
    res.send();
  } catch(err) {
    res.status(401).send(err.message);
  }
};

export default Handler;