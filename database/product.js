const { databaseTransaction } = require('./db');

async function selectProducts() {
  const sql = `SELECT p.product_id, p.description, p.price, p.unity, p.stock, p.cost, p.recipe_id, r.description as recipe_description
    FROM product p
    LEFT JOIN recipe r ON r.recipe_id = p.recipe_id
    ORDER BY product_id`;

  const result = await databaseTransaction(sql);

  return result;
}

async function selectProduct(id) {
  const sql = `SELECT p.product_id, p.description, p.price, p.unity, p.stock, p.cost, p.recipe_id, r.description as recipe_description
    FROM product p
    LEFT JOIN recipe r ON r.recipe_id = p.recipe_id
    WHERE product_id = $1
    ORDER BY product_id`;

  const result = await databaseTransaction(sql, [id]);

  return result;
}

async function insertProduct(body) {
  const recipeId = body.recipe_id === '' ? 0 : body.recipe_id;

  let sql = 'SELECT cost FROM recipe WHERE recipe_id = $1';

  const result = await databaseTransaction(sql, [recipeId]);

  const recipeCost = result[0] ? result[0].cost : 0;

  sql =
    'INSERT INTO product (description, price, unity, stock, cost, recipe_id) VALUES ($1, $2, $3, $4, $5, $6)';

  const args = [
    body.description,
    body.price,
    body.unity,
    body.stock,
    recipeCost,
    recipeId,
  ];

  await databaseTransaction(sql, args);

  const id = await databaseTransaction('SELECT MAX(product_id) FROM product');

  return id[0].max;
}

async function updateProduct(body) {
  const recipeId = body.recipe_id === '' ? 0 : body.recipe_id;

  let sql = 'SELECT cost FROM recipe WHERE recipe_id = $1';

  const result = await databaseTransaction(sql, [recipeId]);

  const recipeCost = result[0] ? result[0].cost : 0;

  sql =
    'UPDATE product SET description = $1, cost = $2, price = $3, unity = $4, stock = $5, recipe_id = $6 WHERE product_id = $7';

  const args = [
    body.description,
    recipeCost,
    body.price,
    body.unity,
    body.stock,
    recipeId,
    body.product_id,
  ];

  await databaseTransaction(sql, args);

  return body.product_id;
}

async function deleteProduct(id) {
  const sql = 'DELETE FROM product WHERE product_id = $1';

  await databaseTransaction(sql, [id]);

  return;
}

module.exports = {
  selectProducts,
  selectProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
};
