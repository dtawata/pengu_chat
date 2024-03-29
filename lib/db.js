import mysql from 'mysql2';
import { hashPassword } from './auth';

export const connection = mysql.createPool({
  host: 'ec2-44-203-163-88.compute-1.amazonaws.com',
  user: 'admin',
  password: 'mysql1234',
  database: 'slack'
});

// GET
export const getJoinedRoom = async ({ userId, roomId }) => {
  const queryString = 'SELECT * FROM joined_rooms WHERE user_id = ? AND room_id = ? LIMIT 1';
  const queryArgs = [userId, roomId];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0][0];
};

export const getMessages = async ({ roomId, channelId }) => {
  const queryString = 'SELECT users.username, users.image, messages.* FROM users INNER JOIN messages ON users.id = messages.user_id WHERE room_id = ? AND channel_id = ? ORDER BY messages.created_at';
  const queryArgs = [roomId, channelId];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

export const getUser = async (email) => {
  const queryString = 'SELECT id, email, username, image FROM users WHERE email = ? LIMIT 1';
  const queryArgs = [email];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0][0];
};

export const getUsers = async (roomId) => {
  const queryString = 'SELECT users.id, users.username, users.image, rooms.path AS room FROM users INNER JOIN joined_rooms ON users.id = joined_rooms.user_id INNER JOIN rooms ON rooms.id = joined_rooms.room_id WHERE joined_rooms.room_id = ?';
  const queryArgs = [roomId];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

export const getNotifications = async (userId) => {
  const queryString = 'select notifications.*, rooms.name as room, users.username as username from notifications inner join rooms on notifications.room_id = rooms.id inner join users on notifications.from_id = users.id AND responded = 0 AND to_id = ?';
  const queryArgs = [userId];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

export const getRoom = async (roomId) => {
  const queryString = 'SELECT * from rooms WHERE id = ?';
  const queryArgs = [roomId];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0][0];
};


// POST
export const addJoinedRoom = async ({ userId, roomId }) => {
  const queryString = 'INSERT INTO joined_rooms (user_id, room_id) VALUES ?';
  const queryArgs = [[[userId, roomId]]];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

export const addRoom = async ({ name, path, image }) => {
  const queryString = 'INSERT INTO rooms (name, path, image) VALUES ?';
  const queryArgs = [[[name, path, image]]];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
};

export const updateNotification = async (id) => {
  const queryString = 'update notifications set responded = 1 where id = ?';
  const queryArgs = [id];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
}




export const getUserId = async (username) => {
  const queryString = 'SELECT id FROM users WHERE username = ? LIMIT 1';
  const queryArgs = [username];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0][0];
};








export const addChannel = async ({ name, path, roomId }) => {
  const queryString = 'INSERT INTO channels (name, path, room_id) VALUES ?';
  const queryArgs = [[[name, path, roomId]]];
  const data = await connection.promise().query(queryString, queryArgs);
  return data[0];
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






// export const addRoom = async ({ name, namespace_id }) => {
//   const queryString = 'INSERT INTO rooms (name, namespace_id) VALUES ?';
//   const queryArgs = [[[name, namespace_id]]];
//   const data = await connection.promise().query(queryString, queryArgs);
//   return data[0];
// };




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








