// api/models.js
import { DataTypes } from "sequelize";
import { sequelize } from "./db.js"; // pastikan pakai .js

export const Players = sequelize.define(
  "players",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_time: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: true, createdAt: "created_at", updatedAt: false }
);

export const Levels = sequelize.define(
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

export const Dinos = sequelize.define(
  "dinos",
  {
    dino_name: { type: DataTypes.STRING },
    dino_type: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
  },
  { timestamps: true, createdAt: "obtained_at", updatedAt: false }
);

export const Questions = sequelize.define(
  "questions",
  {
    level: { type: DataTypes.INTEGER },
    question_text: { type: DataTypes.TEXT },
    correct_answer: { type: DataTypes.STRING },
    number1: { type: DataTypes.INTEGER },
    number2: { type: DataTypes.INTEGER },
    operation: { type: DataTypes.ENUM("×", "÷") },
    final_answer: { type: DataTypes.INTEGER },
  },
  { timestamps: false }
);

export const Answers = sequelize.define(
  "answers",
  {
    answer_text: { type: DataTypes.STRING },
    is_correct: { type: DataTypes.BOOLEAN },
    time_spent: { type: DataTypes.INTEGER },
  },
  { timestamps: true, createdAt: "answered_at", updatedAt: false }
);
