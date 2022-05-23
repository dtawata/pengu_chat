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

CREATE TABLE namespaces (
  id INT NOT NULL auto_increment,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE rooms (
  id INT NOT NULL auto_increment,
  name VARCHAR(255) NOT NULL,
  namespace_id INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(namespace_id) REFERENCES namespaces(id)
);

INSERT INTO namespaces(name) VALUES('/');
INSERT INTO rooms(name, namespace_id) VALUES('lobby', 1);


create table messages (
  id INT NOT NULL auto_increment,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  content varchar(255),
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(room_id) REFERENCES rooms(id)
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

-- INSERT INTO messages(user_id, room_id, content) VALUES(1, 1, 'Hi! this is penguin');

CREATE TABLE joined_rooms (
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  PRIMARY KEY(user_id, room_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(room_id) REFERENCES rooms(id)
);