const { databaseTransaction } = require('./db');

async function selectRecipes() {
  const sql =
    'SELECT recipe_id, description, cost FROM recipe ORDER BY recipe_id';

  const result = await databaseTransaction(sql);

  return result;
}

async function selectRecipe(id) {
  let sql =
    'SELECT recipe_id, description, cost FROM recipe WHERE recipe_id = $1';

  let result = await databaseTransaction(sql, [id]);

  let obj = result[0];

  sql = `SELECT recipe_ingredient.ingredient_id, ingredient.description, recipe_ingredient.quantity, ingredient.cost
    FROM recipe_ingredient 
    LEFT JOIN ingredient ON ingredient.ingredient_id = recipe_ingredient.ingredient_id
    WHERE recipe_id = $1`;

  result = await databaseTransaction(sql, [id]);

  obj = {
    ...obj,
    itens: result,
  };

  return obj;
}

async function insertRecipe(body) {
  let sql = 'INSERT INTO recipe (description, cost) VALUES ($1, $2)';

  let args = [body.description, body.cost];

  await databaseTransaction(sql, args);

  const recipe_id = await databaseTransaction(
    'SELECT MAX(recipe_id) FROM recipe'
  );

  for (let i = 0; i < body.itens.length; i++) {
    sql =
      'INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity) VALUES ($1, $2, $3)';

    args = [
      recipe_id[0].max,
      body.itens[i].ingredient_id,
      body.itens[i].quantity,
    ];

    await databaseTransaction(sql, args);
  }

  return recipe_id[0].max;
}

async function updateRecipe(body) {
  const recipeId = body.recipe_id;

  let sql =
    'UPDATE recipe SET description = $1, cost = $2 WHERE recipe_id = $3';

  let args = [body.description, body.cost, recipeId];

  await databaseTransaction(sql, args);

  sql = 'DELETE FROM recipe_ingredient WHERE recipe_id = $1';
  args = [recipeId];

  await databaseTransaction(sql, args);

  for (let i = 0; i < body.itens.length; i++) {
    sql =
      'INSERT INTO recipe_ingredient (ingredient_id, quantity, recipe_id) VALUES ($1,$2,$3)';

    args = [body.itens[i].ingredient_id, body.itens[i].quantity, recipeId];

    await databaseTransaction(sql, args);
  }

  return recipeId;
}

async function deleteRecipe(id) {
  let sql = 'SELECT DISTINCT 1 FROM product WHERE recipe_id = $1';

  const res = await databaseTransaction(sql, [id]);
  console.log(res[0]);
  if (res[0]) {
    throw new Error(
      'Receita já está vinculada à um produto, não pode ser excluída.'
    );
  }

  sql = 'DELETE FROM recipe WHERE recipe_id = $1';

  await databaseTransaction(sql, [id]);

  sql = 'DELETE FROM recipe_ingredient WHERE recipe_id = $1';

  await databaseTransaction(sql, [id]);

  return;
}

module.exports = {
  selectRecipes,
  selectRecipe,
  insertRecipe,
  updateRecipe,
  deleteRecipe,
};
