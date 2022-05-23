import { connection } from '../../lib/db';

const Handler = async (req, res) => {
  try {
    const queryString = 'select * from users';
    const data = await connection.promise().query(queryString);
    res.send(data[0]);
  } catch(error) {
    res.send('error');
  }
};

export default Handler;