import { sequelize } from "./db.js";
import { Dinos } from "./models.js";

export default async function handler(req, res) {
  try {
    await sequelize.authenticate();
    const dinos = await Dinos.findAll();
    res.status(200).json(dinos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
