const express = require('express');

const db = require('../database/product');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const cliente = await db.selectProduct(req.params.id);

    res.status(200).json(cliente);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar o produto.', error });
  }
});

router.get('/', async (_, res) => {
  try {
    const clientes = await db.selectProducts();

    res.status(200).json(clientes);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar os produtos.', error });
  }
});

router.post('/', async (req, res) => {
  try {
    let status = 200;
    let productId;

    if (!!req.body.id) {
      productId = await db.updateProduct(req.body);
    } else {
      productId = await db.insertProduct(req.body);

      status = 201;
    }

    res.status(status).json({ retorno: 'Sucesso', id: productId });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Erro ao incluir/alterar o produto.', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteProduct(req.params.id);

    res.sendStatus(204);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Erro ao excluir o produto.', error: error.message });
  }
});

module.exports = router;
