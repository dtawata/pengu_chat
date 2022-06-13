import { getSession } from 'next-auth/react';
import { getUser, getNotifications } from '../../lib/db';

const Handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const email = session.user.email;
    const user = await getUser(email);
    const userId = user.id;
    const notifications = await getNotifications(userId);
    res.send(notifications);
  } catch(err) {
    res.status(401).send(err.message);
  }
};

export default Handler;