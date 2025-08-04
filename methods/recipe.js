const express = require('express');

const db = require('../database/recipe');
const log = require('../database/log');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const recipe = await db.selectRecipe(req.params.id);

    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar a receita', error });

    log.generateLog(error, SCREEN);
  }
});

router.get('/', async (_, res) => {
  try {
    const recipes = await db.selectRecipes();

    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar as receitas', error });

    log.generateLog(error, SCREEN);
  }
});

router.post('/', async (req, res) => {
  try {
    let status = 200;
    let recipeId;

    if (!!req.body.recipe_id) {
      recipeId = await db.updateRecipe(req.body);
    } else {
      status = 201;
      recipeId = await db.insertRecipe(req.body);
    }

    res.status(status).json({ retorno: 'Sucesso', id: recipeId });

    log.generateLog(
      `Receita ${recipeId} ${(status = 201 ? 'incluída' : 'alterada')}.`,
      SCREEN
    );
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Erro ao incluir/alterar a receita.', error });

    log.generateLog(error, SCREEN);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteRecipe(req.params.id);

    res.sendStatus(204);

    log.generateLog(`Receita ${req.params.id} excluída.`, SCREEN);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Erro ao excluir a receita.', error: error.message });

    log.generateLog(error, SCREEN);
  }
});

module.exports = router;
