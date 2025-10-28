
-- Database: math_game_niki
-- Pastikan sudah menjalankan: CREATE DATABASE math_game_niki;

CREATE DATABASE IF NOT EXISTS railway;
USE railway;


-- USE math_game_niki;

-- Tabel pemain
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    score INT DEFAULT 0,
    total_time INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel level
CREATE TABLE levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    level_number INT,
    status ENUM('unlocked','locked','completed') DEFAULT 'locked',
    score INT DEFAULT 0,
    time_spent INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Tabel dinosaurus
CREATE TABLE dinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    dino_name VARCHAR(50),
    dino_type VARCHAR(50),
    image VARCHAR(255),
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Tabel pertanyaan
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level INT,
    question_text TEXT,
    question_image VARCHAR(255),
    correct_answer VARCHAR(50),
    number1 INT,
    number2 INT,
    operation ENUM('×','÷'),
    final_answer INT
);

-- Data dummy pemain
INSERT INTO players (name, score, total_time) VALUES
('Andi', 25, 120),
('Budi', 40, 200),
('Citra', 15, 300);

-- Data dummy dinosaurus
INSERT INTO dinos (player_id, dino_name, dino_type, image) VALUES
(1, 'Tyrannosaurus Rex', 'Carnivore', 't_rex.png'),
(1, 'Triceratops', 'Herbivore', 'triceratops.png'),
(2, 'Velociraptor', 'Carnivore', 'velociraptor.png');

-- Data dummy soal
INSERT INTO questions (level, question_text, correct_answer, number1, number2, operation, final_answer) VALUES
(1, 'Berapakah 3 × 4 ?', '12', 3, 4, '×', 12),
(1, 'Berapakah 5 × 6 ?', '30', 5, 6, '×', 30),
(2, 'Berapakah 12 ÷ 3 ?', '4', 12, 3, '÷', 4),
(2, 'Berapakah 20 ÷ 5 ?', '4', 20, 5, '÷', 4),
(3, 'Siti mempunyai 3 kotak, setiap kotak berisi 4 apel. Berapa total apel yang dimiliki Siti?', '12', 3, 4, '×', 12),
(4, 'Ali membagi 12 kue kepada 4 temannya. Berapa kue yang diterima masing-masing teman?', '3', 12, 4, '÷', 3);


-- INIT.SQL
-- init.sql for math_game_niki
-- CREATE DATABASE IF NOT EXISTS math_game;
-- USE math_game;

-- DROP TABLE IF EXISTS answers;
-- DROP TABLE IF EXISTS dinos;
-- DROP TABLE IF EXISTS levels;
-- DROP TABLE IF EXISTS questions;
-- DROP TABLE IF EXISTS players;

-- CREATE TABLE players (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(50) NOT NULL UNIQUE,
--   score INT DEFAULT 0,
--   total_time INT DEFAULT 0,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE levels (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   player_id INT,
--   level_number INT,
--   status ENUM('unlocked','locked','completed') DEFAULT 'locked',
--   score INT DEFAULT 0,
--   time_spent INT DEFAULT 0,
--   FOREIGN KEY (player_id) REFERENCES players(id)
-- );

-- CREATE TABLE dinos (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   player_id INT,
--   dino_name VARCHAR(50),
--   dino_type VARCHAR(50),
--   image VARCHAR(255),
--   obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (player_id) REFERENCES players(id)
-- );

-- CREATE TABLE questions (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   level INT,
--   question_text TEXT,
--   question_image VARCHAR(255),
--   correct_answer VARCHAR(50),
--   number1 INT,
--   number2 INT,
--   operation ENUM('×','÷'),
--   final_answer INT
-- );

CREATE TABLE answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT,
  question_id INT,
  answer_text VARCHAR(255),
  is_correct BOOLEAN,
  time_spent INT,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Dummy questions: Level 3 & 4 story examples (5 each)
INSERT INTO questions (level, question_text, question_image, correct_answer, number1, number2, operation, final_answer) VALUES
(3, 'Pak Budi membeli 3 kotak pensil, setiap kotak berisi 4 pensil. Berapa jumlah pensil yang dibeli Pak Budi?', NULL, '12', NULL, NULL, NULL, 12),
(3, 'Di kebun terdapat 15 biji jeruk dibagi rata ke 3 keranjang. Berapa biji jeruk tiap keranjang?', NULL, '5', NULL, NULL, NULL, 5),
(3, 'Siti memiliki 2 kantong permen, tiap kantong 6 permen. Berapa total permen Siti?', NULL, '12', NULL, NULL, NULL, 12),
(3, 'Seekor dinosaurus makan 8 apel per hari. Berapa apel yang dimakan dalam 3 hari?', NULL, '24', NULL, NULL, NULL, 24),
(3, 'Ayah memotong sebuah papan menjadi 4 bagian sama panjang. Panjang papan 12 m, berapa panjang tiap bagian?', NULL, '3', NULL, NULL, NULL, 3);

INSERT INTO questions (level, question_text, question_image, correct_answer, number1, number2, operation, final_answer) VALUES
(4, 'Rina membeli 3 paket sticker, tiap paket berisi 4 sticker. Isi field: angka1, operasi, angka2, jawaban akhir', NULL, NULL, 3, 4, '×', 12),
(4, 'Sebuah kotak berisi 12 kue, dibagi ke dalam 3 piring sama banyak. Isi field: angka1, operasi, angka2, jawaban akhir', NULL, NULL, 12, 3, '÷', 4),
(4, 'Sebuah kelompok memiliki 5 kotak, tiap kotak 2 mainan. Isi field: angka1, operasi, angka2, jawaban akhir', NULL, NULL, 5, 2, '×', 10),
(4, '24 apel dibagi ke dalam 6 keranjang sama banyak. Isi field: angka1, operasi, angka2, jawaban akhir', NULL, NULL, 24, 6, '÷', 4),
(4, '3 tas, tiap tas berisi 3 buku. Isi field: angka1, operasi, angka2, jawaban akhir', NULL, NULL, 3, 3, '×', 9);
