// routes/index.js
const express = require('express');
const router = express.Router();
const { Players, Levels, Dinos, Questions, Answers } = require('../models').models;
const { sequelize } = require('../models');
const { Op, UniqueConstraintError } = require('sequelize');

// Health
router.get('/health', (req, res) => res.json({ ok: true }));

// Create or get player by name (simple login)
router.post('/player', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  let player = await Players.findOne({ where: { name } });
  if (!player) {
    player = await Players.create({ name });
    // create level rows
    for (let i = 1; i <= 4; i++) {
      await Levels.create({
        player_id: player.id,
        level_number: i,
        status: i === 1 ? 'unlocked' : 'locked'
      });
    }
  }

  // get levels
  const levels = await Levels.findAll({ where: { player_id: player.id } });
  const dinos = await Dinos.findAll({ where: { player_id: player.id } });

  res.json({ player, levels, dinos });
});

// Get questions by level (level 1 & 2 random generator if not in DB)
router.get('/questions/:playerId/:level', async (req, res) => {
  const level = parseInt(req.params.level);
  const playerId = parseInt(req.params.playerId);

  // Check if level already completed for player
  const lvlRow = await Levels.findOne({
    where: { player_id: playerId, level_number: level }
  });
  if (lvlRow && lvlRow.status === 'completed') {
    return res.status(409).json({
      error: 'Level already completed',
      score: lvlRow.score,
      time_spent: lvlRow.time_spent
    });
  }

  if (level === 1 || level === 2) {
    // Generate 5 random questions (1-10)
    const qs = [];
    for (let i = 0; i < 5; i++) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;

      if (level === 1) {
        qs.push({
          id: i + 1,
          question_text: `${a} × ${b} = ?`,
          number1: a,
          number2: b,
          operation: '×',
          correct_answer: String(a * b)
        });
      } else {
        qs.push({
          id: i + 1,
          question_text: `${a * b} ÷ ${b} = ?`,
          number1: a * b,
          number2: b,
          operation: '÷',
          correct_answer: String(a)
        });
      }
    }
    return res.json(qs);
  } else {
    const q = await Questions.findAll({ where: { level } });
    return res.json(q);
  }
});

// Submit answer for a question
// NOTE: modified to create Answer row first, then create Dino with answer_id
router.post('/answer', async (req, res) => {
  const { player_id, question_id, level, answer_payload, time_spent } = req.body;
  if (!player_id || !level) {
    return res.status(400).json({ error: 'player_id and level required' });
  }

  let isCorrect = false;
  let correctAnswer = null;

  if (level === 1 || level === 2) {
    // answer_payload expected { number1, number2, operation, final_answer }
    const { number1, number2, operation, final_answer } = answer_payload || {};
    if (operation === '×') {
      correctAnswer = String(Number(number1) * Number(number2));
    } else if (operation === '÷') {
      correctAnswer = String(Number(number1) / Number(number2));
    }
    isCorrect = String(final_answer) === String(correctAnswer);
  } else if (level === 3) {
    const q = await Questions.findByPk(question_id);
    if (q) {
      correctAnswer = String(q.final_answer || q.correct_answer || q.final_answer);
      isCorrect = String(answer_payload.final_answer) === String(correctAnswer);
    }
    } else if (level === 4) {
      const q = await Questions.findByPk(question_id);
      isCorrect = false; // reset biar gak bawa nilai dari level lain
      correctAnswer = q ? q.correct_answer : null;

      if (q && answer_payload) {
        const providedOp = (answer_payload.operation || '').trim();
        const n1 = answer_payload.number1;
        const n2 = answer_payload.number2;
        const final = answer_payload.final_answer;

        // validasi: kalau ada yang kosong, langsung salah
        if (n1 === '' || n2 === '' || final === '' || !providedOp) {
          isCorrect = false;
        } else {
          const a = Number(n1);
          const b = Number(n2);
          const finalAns = Number(final);
          let calc = null;

          if (providedOp === '×') calc = a * b;
          if (providedOp === '÷') calc = b !== 0 ? a / b : null;

          if (calc !== null) {
            isCorrect = finalAns === calc;

            // terima perkalian terbalik
            if (!isCorrect && providedOp === '×') {
              isCorrect = finalAns === Number(n2) * Number(n1);
            }
          }
        }
      }
    }

  // Save answer (include level)
  const answerRow = await Answers.create({
    player_id,
    question_id: question_id || null,
    answer_text: String(JSON.stringify(answer_payload)),
    is_correct: !!isCorrect,
    time_spent: time_spent || 0,
    level: level || null
  });

  if (isCorrect) {
    const dinoTypes = [
      'Allosaurus',
      'Ankylosaurus',
      'Apatosaurus',
      'Argentinosaurus',
      'Brachiosaurus',
      'Carnotaurus',
      'Compsognathus',
      'Cryolophosaurus',
      'Dilophosaurus',
      'Dracorex',
      'Edmontosaurus',
      'Giganotosaurus',
      'Iguanodon',
      'Kentrosaurus',
      'Maiasaura',
      'Microraptor',
      'Mononykus',
      'Ouranosaurus',
      'Pachycephalosaurus',
      'Parasaurolophus',
      'Pterodactyl',
      'Sauropelta',
      'Spinosaurus',
      'Stegosaurus',
      'Tarbosaurus',
      'Therizinosaurus',
      'Triceratops',
      'Troodon',
      'Tyrannosaurus_Rex',
      'Velociraptor'
    ];
    const type = dinoTypes[Math.floor(Math.random() * dinoTypes.length)];
    const name = `${type}-${Math.floor(Math.random() * 9000) + 1000}`;
    const img = `/assets/images/${type.toLowerCase()}.png`;

    let newDino;
    try {
      newDino = await Dinos.create({
        player_id,
        dino_name: name,
        dino_type: type,
        image: img,
        answer_id: answerRow.id
      });
    } catch (err) {
      console.warn('Dino creation failed (maybe duplicate):', err && err.message);
      try {
        newDino = await Dinos.findOne({ where: { answer_id: answerRow.id } });
      } catch (e2) {
        console.error('Failed to find existing dino for answer:', e2 && e2.message);
        newDino = null;
      }
    }
    return res.json({ ok: true, isCorrect, correctAnswer, obtainedDino: newDino });
  } else {
    return res.json({ ok: true, isCorrect, correctAnswer });
  }
});

// Finish level
router.post('/finish-level', async (req, res) => {
  const { player_id, level, obtained_correct_count, time_spent } = req.body;
  if (!player_id || !level) return res.status(400).json({ error: 'player_id and level required' });

  const player = await Players.findByPk(player_id);
  if (!player) return res.status(404).json({ error: 'Player not found' });

  const lvlRow = await Levels.findOne({ where: { player_id, level_number: level } });
  if (lvlRow && lvlRow.status === 'completed') {
    return res.status(409).json({ error: 'Level already completed' });
  }

  const points = (obtained_correct_count || 0) * 5;

  if (lvlRow) {
    await lvlRow.update({ status: 'completed', score: points, time_spent: time_spent || 0 });
  } else {
    await Levels.create({
      player_id,
      level_number: level,
      status: 'completed',
      score: points,
      time_spent: time_spent || 0
    });
  }

  // Update player totals
  const levels = await Levels.findAll({ where: { player_id } });
  const totalScore = levels.reduce((s, r) => s + (r.score || 0), 0);
  const totalTime = levels.reduce((t, r) => t + (r.time_spent || 0), 0);
  await player.update({ score: totalScore, total_time: totalTime });

  // Award dinos
  const dinoTypes = [
    'Allosaurus',
    'Ankylosaurus',
    'Apatosaurus',
    'Argentinosaurus',
    'Brachiosaurus',
    'Carnotaurus',
    'Compsognathus',
    'Cryolophosaurus',
    'Dilophosaurus',
    'Dracorex',
    'Edmontosaurus',
    'Giganotosaurus',
    'Iguanodon',
    'Kentrosaurus',
    'Maiasaura',
    'Microraptor',
    'Mononykus',
    'Ouranosaurus',
    'Pachycephalosaurus',
    'Parasaurolophus',
    'Pterodactyl',
    'Sauropelta',
    'Spinosaurus',
    'Stegosaurus',
    'Tarbosaurus',
    'Therizinosaurus',
    'Triceratops',
    'Troodon',
    'Tyrannosaurus_Rex',
    'Velociraptor'
  ];
  const obtained = [];

  const correctAnswers = await Answers.findAll({
    where: { player_id, level, is_correct: true },
    attributes: ['id']
  });
  const correctAnswerIds = correctAnswers.map(a => a.id);

  let alreadyAwarded = 0;
  if (correctAnswerIds.length > 0) {
    alreadyAwarded = await Dinos.count({ where: { answer_id: { [Op.in]: correctAnswerIds } } });
  }

  const toCreate = Math.max(0, (obtained_correct_count || 0) - alreadyAwarded);

  for (let i = 0; i < toCreate; i++) {
    const type = dinoTypes[Math.floor(Math.random() * dinoTypes.length)];
    const name = `${type}-${Math.floor(Math.random() * 9000) + 1000}`;
    const img = `/assets/images/${type.toLowerCase()}.png`;

    const d = await Dinos.create({
      player_id,
      dino_name: name,
      dino_type: type,
      image: img
    });
    obtained.push(d);
  }

  res.json({ ok: true, totalScore, totalTime, obtained });
});

// Get dinos for player
router.get('/dinos/:playerId', async (req, res) => {
  const playerId = parseInt(req.params.playerId);
  const dinos = await Dinos.findAll({
    where: { player_id: playerId },
    order: [['obtained_at', 'DESC']]
  });
  res.json(dinos);
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  const players = await Players.findAll({
    order: [['score', 'DESC'], ['total_time', 'ASC']]
  });

  const result = await Promise.all(
    players.map(async p => {
      const dinos = await Dinos.count({ where: { player_id: p.id } });
      return {
        id: p.id,
        name: p.name,
        score: p.score,
        total_time: p.total_time,
        dinos
      };
    })
  );

  res.json(result);
});

module.exports = router;
