DROP DATABASE IF EXISTS slack;
CREATE DATABASE slack;
USE slack;

CREATE TABLE users (
  id INT NOT NULL auto_increment,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fname VARCHAR(255) NOT NULL,
  lname VARCHAR(255) NOT NULL,
  image VARCHAR(255) DEFAULT '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
  created_at TIMESTAMP DEFAULT NOW(),
  session_id VARCHAR(255),
  personal VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE rooms (
  id INT NOT NULL auto_increment,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  image VARCHAR(255) DEFAULT '/img/default.jpg',
  PRIMARY KEY(id)
);

CREATE TABLE channels (
  id INT NOT NULL auto_increment,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  room_id INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(room_id) REFERENCES rooms(id)
);

create table messages (
  id INT NOT NULL auto_increment,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  channel_id INT NOT NULL,
  content VARCHAR(255),
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(room_id) REFERENCES rooms(id),
  FOREIGN KEY(channel_id) REFERENCES channels(id)
);

create table personal_messages (
  id INT NOT NULL auto_increment,
  created_at TIMESTAMP DEFAULT NOW(),
  from_id INT NOT NULL,
  to_id INT NOT NULL,
  content varchar(255),
  PRIMARY KEY(id),
  FOREIGN KEY(from_id) REFERENCES users(id),
  FOREIGN KEY(to_id) REFERENCES users(id)
);

CREATE TABLE joined_rooms (
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  PRIMARY KEY(user_id, room_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(room_id) REFERENCES rooms(id)
);

INSERT INTO rooms (name, path, image)
VALUES ('RFP57', 'rfp57', '/img/default.jpg');

INSERT INTO channels(name, path, room_id)
VALUES ('general', 'general', 1),
('job-prep-resources', 'job-prep-resources', 1),
('resources', 'resources', 1),
('music', 'music', 1),
('memes-random', 'memes-random', 1);