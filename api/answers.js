import { sequelize } from "./db.js";
import { Answers } from "./models.js";

export default async function handler(req, res) {
  try {
    await sequelize.authenticate();
    const answers = await Answers.findAll();
    res.status(200).json(answers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
