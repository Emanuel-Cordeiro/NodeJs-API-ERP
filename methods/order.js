const express = require('express');

const db = require('../database/order');
const log = require('../database/log');

const router = express.Router();

const SCREEN = 'orders';

router.get('/:id', async (req, res) => {
  try {
    const response = await db.selectOrder(req.params.id);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar o pedido.', error });

    log.generateLog(error, SCREEN);
  }
});

router.get('/', async (req, res) => {
  try {
    const response = await db.selectOrders(
      req.query.startingDate,
      req.query.endingDate,
      req.query.paid
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar os pedidos.', error });

    log.generateLog(error, SCREEN);
  }
});

router.post('/', async (req, res) => {
  try {
    let status = 200;
    let order_id;

    if (!!req.body.order_id) {
      order_id = await db.updateOrder(req.body);
    } else {
      order_id = await db.insertOrder(req.body);
      status = 201;
    }

    res.status(status).json({ retorno: 'Sucesso', id: order_id });

    log.generateLog(
      `Pedido ${order_id} ${(status = 201 ? 'incluído' : 'alterado')}.`,
      SCREEN
    );
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Erro ao inserir/alterar o pedido.', error });

    log.generateLog(error, SCREEN);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteOrder(req.params.id);

    res.sendStatus(204);

    log.generateLog(`Pedido ${req.params.id} excluído.`, SCREEN);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Erro ao excluir o pedido.', error: error.message });

    log.generateLog(error, SCREEN);
  }
});

module.exports = router;
