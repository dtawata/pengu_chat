import mysql from 'mysql2';
import { hashPassword } from './auth';

export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'slack'
});

// APPROVED
export const getUser = async (email) => {
  const queryString = 'SELECT id, email, username, image FROM users WHERE email = ? LIMIT 1';
  const queryArgs = [email];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0][0];
};

export const checkNamespace = async (user_id, room_id) => {
  const queryString = 'select * from joined_namespaces where user_id = ? and (select namespace_id from rooms where id = ?)';
  const queryArgs = [user_id, room_id];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0][0];
}

export const getChannels = async (roomId) => {
  const queryString = 'select * from channels where room_id = ?';
  const queryArgs = [roomId];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
}







export const addUser = async ({ email, username, password, fname, lname, personal }) => {
  const hashedPassword = await hashPassword(password);
  const queryString = 'INSERT INTO users (email, username, password, fname, lname, personal) VALUES ?';
  const queryArgs = [[[email, username, hashedPassword, fname, lname, personal]]];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
}






export const addRoom = async ({ name, namespace_id }) => {
  const queryString = 'INSERT INTO rooms (name, namespace_id) VALUES ?';
  const queryArgs = [[[name, namespace_id]]];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

export const addJoinedRoom = async ({ user_id, room_id }) => {
  const queryString = 'INSERT INTO joined_rooms (user_id, room_id) VALUES ?';
  const queryArgs = [[[user_id, room_id]]];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

export const addJoinedNamespace = async ({ user_id, namespace_id }) => {
  const queryString = 'INSERT INTO joined_namespaces (user_id, namespace_id) VALUES ?';
  const queryArgs = [[[user_id, namespace_id]]];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};


export const getMessages = async (channelId) => {
  const queryString = 'SELECT * FROM users INNER JOIN messages ON users.id = messages.user_id WHERE channel_id = ?'
  const queryArgs = [channelId];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

export const getPersonalMessages = async ({ from, to }) => {
  const queryString = 'SELECT * FROM users INNER JOIN personal_messages ON users.id = personal_messages.from_id WHERE from_id = ? AND to_id = ? OR from_id = ? and to_id = ? ORDER BY personal_messages.id ASC';
  const queryArgs = [from, to, to, from];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

















export const getUserRooms = async ({ user_id }) => {
  const queryString = 'SELECT * FROM joined_rooms WHERE user_id = ?';
  const queryArgs = [user_id];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

// export const getUser = async (username) => {
//   const queryString = 'SELECT * FROM users WHERE username = ?';
//   const queryArgs = [username];
//   const data = await connection.promise().query(queryString, queryArgs);
//   return data[0];
// };






export const getUsers = async (user) => {
  const queryString = 'select * from users';
  const data = await connection.promise().query(queryString);
  return data[0];
};


export const getJoinedRoom = async ({ userId, roomId }) => {
  const queryString = 'SELECT * FROM joined_rooms WHERE user_id = ? AND room_id = ? LIMIT 1';
  const queryArgs = [userId, roomId];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0][0];
};

// export const getJoinedRoom = async(userId, roomId) => {
//   const queryString = 'SELECT rooms.* FROM rooms INNER JOIN joined_rooms ON rooms.id = joined_rooms.room_id WHERE joined_rooms.user_id = ? AND joined_rooms.room_id = ?';
//   const queryArgs = [userId, roomId];
//   const data = await connection.promise().query(queryString, queryArgs);
//   return data[0];
// };