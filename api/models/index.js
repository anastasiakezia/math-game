const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.DB_NAME || 'math_game',
//   process.env.DB_USER || 'mguser',
//   process.env.DB_PASS || 'mgpass',
//   {
//     host: process.env.DB_HOST || 'localhost',
//     port: process.env.DB_PORT || 3306,
//     dialect: 'mysql',
//     logging: false
//   }
// );

const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(process.cwd(), "database.sqlite"),
  logging: false,
});

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
    // new column: link to Answers if this dino was created from an answer
    answer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true, // enforce one-to-one (one answer => at most one dino)
      references: {
        model: "answers", // refers to table name 'answers'
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
    // new column: which level this answer belongs to (important for generated questions level 1/2)
    level: { type: DataTypes.INTEGER, allowNull: true },
  },
  { timestamps: true, createdAt: "answered_at", updatedAt: false }
);

// Associations
Players.hasMany(Levels, { foreignKey: "player_id" });
Levels.belongsTo(Players, { foreignKey: "player_id" });

Players.hasMany(Dinos, { foreignKey: "player_id" });
Dinos.belongsTo(Players, { foreignKey: "player_id" });

Players.hasMany(Answers, { foreignKey: "player_id" });
Answers.belongsTo(Players, { foreignKey: "player_id" });

Questions.hasMany(Answers, { foreignKey: "question_id" });
Answers.belongsTo(Questions, { foreignKey: "question_id" });

// New association: one Answer may have one Dino (the dino created as a reward for that answer)
Answers.hasOne(Dinos, { foreignKey: "answer_id" });
Dinos.belongsTo(Answers, { foreignKey: "answer_id" });

module.exports = {
  sequelize,
  models: { Players, Levels, Dinos, Questions, Answers },
};
