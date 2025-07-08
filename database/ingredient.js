const { databaseTransaction } = require('./db');

async function selectIngredients() {
  const sql =
    'SELECT ingredient_id, description, unity, cost, stock FROM ingredient ORDER BY ingredient_id';

  const result = await databaseTransaction(sql);

  return result;
}

async function selectIngredient(id) {
  const sql =
    'SELECT ingredient_id, description, unity, cost, stock  FROM ingredient WHERE ingredient_id = $1';

  const result = await databaseTransaction(sql, [id]);

  return result;
}

async function insertIngredient(ingredient) {
  const sql =
    'INSERT INTO ingredient (description, unity, cost, stock) VALUES ($1, $2, $3, $4)';

  const args = [
    ingredient.description,
    ingredient.unity,
    ingredient.cost,
    ingredient.stock,
  ];

  await databaseTransaction(sql, args);

  const id = await databaseTransaction(
    'SELECT MAX(ingredient_id) FROM ingredient'
  );

  return id[0].max;
}

async function updateIngredient(ingredient) {
  const sql =
    'UPDATE ingredient SET description = $1, unity = $2, cost = $3, stock = $4 WHERE ingredient_id = $5';

  const args = [
    ingredient.description,
    ingredient.unity,
    ingredient.cost,
    ingredient.stock,
    ingredient.ingredient_id,
  ];

  await databaseTransaction(sql, args);

  return ingredient.ingredient_id;
}

async function deleteIngredient(id) {
  let sql = 'SELECT DISTINCT 1 FROM recipe_ingredient WHERE ingredient_id = $1';

  const res = await databaseTransaction(sql, [id]);

  if (res[0]) {
    throw new Error('Ingrediente já está em receitas e não pode ser excluído.');
  }

  sql = 'DELETE FROM ingredient WHERE ingredient_id = $1';

  await databaseTransaction(sql, [id]);

  return;
}

module.exports = {
  selectIngredient,
  selectIngredients,
  insertIngredient,
  updateIngredient,
  deleteIngredient,
};
