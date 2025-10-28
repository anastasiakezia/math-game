export default async function handler(req, res) {
  console.log("Running /api/players");  // ← ini harus muncul di Vercel logs
  try {
    const players = await Players.findAll();
    res.status(200).json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}



// api/players.js
import { sequelize } from "./db.js";
import { Players } from "./models.js";

export default async function handler(req, res) {
  try {
    await sequelize.authenticate();
    const players = await Players.findAll();
    res.status(200).json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
