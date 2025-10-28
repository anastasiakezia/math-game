

DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS dinos;
DROP TABLE IF EXISTS levels;
DROP TABLE IF EXISTS players;

CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    score INT DEFAULT 0,
    total_time INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    level_number INT,
    status ENUM('unlocked','locked','completed') DEFAULT 'locked',
    score INT DEFAULT 0,
    time_spent INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE dinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    dino_name VARCHAR(50),
    dino_type VARCHAR(50),
    image VARCHAR(255),
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level INT,
    question_text TEXT,
    question_image VARCHAR(255),
    correct_answer VARCHAR(50),
    number1 INT DEFAULT 0,
    number2 INT DEFAULT 0,
    operation ENUM('x','/') DEFAULT 'x',
    final_answer INT
);

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

INSERT INTO players (name, score, total_time) VALUES
('Andi', 25, 120),
('Budi', 40, 200),
('Citra', 15, 300);

INSERT INTO dinos (player_id, dino_name, dino_type, image) VALUES
(1,'Tyrannosaurus Rex','Carnivore','t_rex.png'),
(1,'Triceratops','Herbivore','triceratops.png'),
(2,'Velociraptor','Carnivore','velociraptor.png');

INSERT INTO questions (level, question_text, correct_answer, number1, number2, operation, final_answer) VALUES
(1,'Berapakah 3 x 4 ?','12',3,4,'x',12),
(1,'Berapakah 5 x 6 ?','30',5,6,'x',30),
(2,'Berapakah 12 / 3 ?','4',12,3,'/',4),
(2,'Berapakah 20 / 5 ?','4',20,5,'/',4),
(3,'Siti mempunyai 3 kotak, setiap kotak berisi 4 apel. Berapa total apel yang dimiliki Siti?','12',3,4,'x',12),
(3,'Pak Budi membeli 3 kotak pensil, setiap kotak berisi 4 pensil. Berapa jumlah pensil yang dibeli Pak Budi?','12',3,4,'x',12),
(4,'Ali membagi 12 kue kepada 4 temannya. Berapa kue yang diterima masing-masing teman?','3',12,4,'/',3),
(4,'Rina membeli 3 paket sticker, tiap paket berisi 4 sticker','12',3,4,'x',12);

INSERT INTO answers (player_id, question_id, answer_text, is_correct, time_spent) VALUES
(1,1,'12',TRUE,10),
(2,2,'30',TRUE,12),
(3,3,'4',TRUE,15);
