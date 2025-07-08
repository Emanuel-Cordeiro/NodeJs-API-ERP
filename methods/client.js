const express = require('express');

const db = require('../database/client');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const client = await db.selectCustomer(req.params.id);

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar o cliente.', error });
  }
});

router.get('/', async (_, res) => {
  try {
    const clients = await db.selectCustomers();

    res.status(200).json(clients);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar os clientes.', error });
  }
});

router.post('/', async (req, res) => {
  try {
    let status = 200;
    let client_id;

    if (!!req.body.client_id) {
      client_id = await db.updateCustomer(req.body);
    } else {
      client_id = await db.insertCustomer(req.body);

      status = 201;
    }

    res.status(status).json({ retorno: 'Sucesso', id: client_id });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Erro ao incluir/alterar o cliente.', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteCustomer(req.params.id);

    res.sendStatus(204);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Erro ao excluir o cliente.', error: error.message });
  }
});

module.exports = router;
