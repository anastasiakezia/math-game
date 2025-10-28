import { sequelize } from "./db.js";
import { Levels } from "./models.js";

export default async function handler(req, res) {
  try {
    await sequelize.authenticate();
    const levels = await Levels.findAll();
    res.status(200).json(levels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
