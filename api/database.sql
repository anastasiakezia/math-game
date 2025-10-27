
-- Database: math_game_niki
-- Pastikan sudah menjalankan: CREATE DATABASE math_game_niki;

USE math_game_niki;

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
