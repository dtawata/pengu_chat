DROP DATABASE IF EXISTS slack;
CREATE DATABASE slack;
USE slack;

CREATE TABLE users (
  id INT NOT NULL auto_increment,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
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
  namespace INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(namespace) REFERENCES namespaces(id)
);

CREATE TABLE users_namespaces (
  user_id INT NOT NULL,
  namespace_id INT NOT NULL,
  PRIMARY KEY(user_id, namespace_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(namespace_id) REFERENCES namespaces(id)
);