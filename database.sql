-- PARA SA BAG-O NGA INSTALL (wala pay feedback_shield nga database)
CREATE DATABASE IF NOT EXISTS feedback_shield
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE feedback_shield;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_code VARCHAR(20) NOT NULL,
  user_name VARCHAR(100) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_code VARCHAR(20) NOT NULL,
  user_name VARCHAR(100) NOT NULL DEFAULT '',
  comment TEXT NOT NULL,
  result ENUM('good','bad') NOT NULL,
  detected_words TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
