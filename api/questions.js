import { sequelize } from "./db.js";
import { Questions } from "./models.js";

export default async function handler(req, res) {
  try {
    await sequelize.authenticate();
    const questions = await Questions.findAll();
    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
