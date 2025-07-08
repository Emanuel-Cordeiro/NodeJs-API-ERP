const express = require('express');

const db = require('../database/log');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const log = await db.selectLogs(
      req.query.startingDate,
      req.query.endingDate
    );

    res.status(200).json(log);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar os logs.', error });
  }
});

router.post('/', async (req, res) => {
  try {
    await db.insertLogs(req.body);

    res.status(201).json({ retorno: 'Sucesso' });
  } catch (error) {
    const log = {
      screen: 'Log',
      description: error,
      date: new Date(),
    };
    await db.insertLogs(log);

    res
      .status(400)
      .json({ error: 'Erro ao incluir/alterar o cliente.', error });
  }
});

module.exports = router;
