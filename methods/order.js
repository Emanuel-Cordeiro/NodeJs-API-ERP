const express = require('express');

const db = require('../database/order');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const response = await db.selectOrder(req.params.id);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar o pedido.', error });
  }
});

router.get('/', async (_, res) => {
  try {
    const response = await db.selectOrders();

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar os pedidos.', error });
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
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Erro ao inserir/alterar o pedido.', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteOrder(req.params.id);

    res.sendStatus(204);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Erro ao excluir o pedido.', error: error.message });
  }
});

module.exports = router;
