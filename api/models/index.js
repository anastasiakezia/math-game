const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
require("dotenv").config();

// =====================
// DATABASE CONNECTION
// =====================

// --- Gunakan MySQL dari Railway ---
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

// =====================
// MODELS
// =====================

const Players = sequelize.define(
  "players",
  {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_time: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: false }
);

const Levels = sequelize.define(
  "levels",
  {
    level_number: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM("unlocked", "locked", "completed"),
      defaultValue: "locked",
    },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    time_spent: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false }
);

const Dinos = sequelize.define(
  "dinos",
  {
    dino_name: { type: DataTypes.STRING },
    dino_type: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    answer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: "answers",
        key: "id",
      },
    },
  },
  { timestamps: true, createdAt: "obtained_at", updatedAt: false }
);

const Questions = sequelize.define(
  "questions",
  {
    level: { type: DataTypes.INTEGER },
    question_text: { type: DataTypes.TEXT },
    question_image: { type: DataTypes.STRING },
    correct_answer: { type: DataTypes.STRING },
    number1: { type: DataTypes.INTEGER },
    number2: { type: DataTypes.INTEGER },
    operation: { type: DataTypes.ENUM("×", "÷") },
    final_answer: { type: DataTypes.INTEGER },
  },
  { timestamps: false }
);

const Answers = sequelize.define(
  "answers",
  {
    answer_text: { type: DataTypes.STRING },
    is_correct: { type: DataTypes.BOOLEAN },
    time_spent: { type: DataTypes.INTEGER },
    level: { type: DataTypes.INTEGER, allowNull: true },
  },
  { timestamps: true, createdAt: "answered_at", updatedAt: false }
);

// =====================
// ASSOCIATIONS
// =====================

Players.hasMany(Levels, { foreignKey: "player_id" });
Levels.belongsTo(Players, { foreignKey: "player_id" });

Players.hasMany(Dinos, { foreignKey: "player_id" });
Dinos.belongsTo(Players, { foreignKey: "player_id" });

Players.hasMany(Answers, { foreignKey: "player_id" });
Answers.belongsTo(Players, { foreignKey: "player_id" });

Questions.hasMany(Answers, { foreignKey: "question_id" });
Answers.belongsTo(Questions, { foreignKey: "question_id" });

Answers.hasOne(Dinos, { foreignKey: "answer_id" });
Dinos.belongsTo(Answers, { foreignKey: "answer_id" });

// =====================
// EXPORT
// =====================
module.exports = {
  sequelize,
  models: { Players, Levels, Dinos, Questions, Answers },
};
