const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'slack'
});

const getRooms = async (user_id) => {
  const queryString = 'SELECT rooms.id, rooms.name FROM rooms INNER JOIN joined_rooms ON rooms.id = joined_rooms.room_id WHERE joined_rooms.user_id = ?';
  const queryArgs = [user_id];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

const getUsers = async (users) => {
  const queryString = 'SELECT id, email, username, image FROM users WHERE username IN ?';
  const queryArgs = [users];
  const data = await connection.promise().query(queryString, [queryArgs]);
  return data[0];
};

const addMessage = async (user_id, room_id, content) => {
  const queryString = 'insert into messages(user_id, room_id, content) VALUES ?';
  const queryArgs = [[[user_id, room_id, content]]];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

const addPersonalMessage = async (user_id, room_id, content) => {
  const queryString = 'insert into personal_messages(from_id, to_id, content) VALUES ?';
  const queryArgs = [[[user_id, room_id, content]]];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};
















const getAllMessages = async (rooms) => {
  const queryString = 'select * from users inner join messages on users.id = messages.user_id where room_id in ?'
  const queryArgs = [rooms];
  const data = await connection.promise().query(queryString, [queryArgs]);
  return data[0];
};

module.exports = {
  getUsers,
  getRooms,
  addMessage,
  addPersonalMessage
};