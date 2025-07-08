const { databaseTransaction } = require('./db');

async function selectOrders() {
  const sql = `SELECT o.order_id, o.client_id, c.name as client_name, o.delivery_date, o.observation, o.paid, o.delivery,
    CAST(SUM(oi.price*oi.quantity) AS NUMERIC(10,2)) AS total_value
    FROM orders o
    LEFT JOIN client c on c.client_id = o.client_id
    LEFT JOIN order_item oi ON oi.order_id = o.order_id
    GROUP BY o.order_id, o.client_id, c.name, o.delivery_date, o.observation, o.paid, o.delivery
    ORDER BY o.order_id`;

  const result = await databaseTransaction(sql);

  const orders = [];

  for (let i = 0; i < result.length; i++) {
    const order = result[i];

    const orderSql =
      'SELECT order_item_order, product_id, quantity, observation, price FROM order_item WHERE order_id = $1';

    const itens = await databaseTransaction(orderSql, [order.order_id]);

    const obj = {
      ...order,
      itens,
    };

    orders.push(obj);
  }

  return orders;
}

async function selectOrder(id) {
  let sql = `SELECT o.order_id, o.client_id, c.name as client_name, o.delivery_date, o.observation, o.paid, o.delivery,
    CAST(SUM(oi.price*oi.quantity) AS NUMERIC(10,2)) AS total_value
    FROM orders o
    LEFT JOIN client c ON c.client_id = o.client_id
    LEFT JOIN order_item oi ON oi.order_id = o.order_id
    WHERE o.order_id = $1
    GROUP BY o.order_id, o.client_id, c.name, o.delivery_date, o.observation, o.paid, o.delivery
    ORDER BY o.order_id`;

  let result = await databaseTransaction(sql, [id]);

  let obj = result[0];

  sql = `SELECT order_item_order, product_id, quantity, price, observation, CAST(SUM(price*quantity) AS NUMERIC(10,2)) AS item_total_value
    FROM order_item 
    WHERE order_id = $1
    GROUP BY order_item_order, product_id, quantity, price, observation`;

  itens = await databaseTransaction(sql, [id]);

  obj = {
    ...obj,
    itens,
  };

  return obj;
}

async function insertOrder(body) {
  let sql =
    'INSERT INTO orders (client_id, delivery_date, observation, paid, delivery) VALUES ($1, $2, $3, $4, $5)';

  let args = [
    body.client_id,
    body.delivery_date,
    body.observation,
    body.paid,
    body.delivery,
  ];

  await databaseTransaction(sql, args);

  const order_id = await databaseTransaction(
    'SELECT MAX(order_id) FROM orders'
  );

  for (let i = 0; i < body.itens.length; i++) {
    sql =
      'INSERT INTO order_item (order_id, order_item_order, product_id, quantity, observation, price) VALUES ($1, $2, $3, $4, $5, $6)';

    args = [
      order_id[0].max,
      body.itens[i].order_item_order,
      body.itens[i].product_id,
      body.itens[i].quantity,
      body.itens[i].observation,
      body.itens[i].price,
    ];

    await databaseTransaction(sql, args);
  }

  return order_id[0].max;
}

async function updateOrder(body) {
  let sql =
    'UPDATE orders SET client_id = $1, delivery_date = $2, observation = $3, paid = $4, delivery = $5 WHERE order_id = $6';

  let args = [
    body.client_id,
    body.delivery_date,
    body.observation,
    body.paid,
    body.delivery,
    body.order_id,
  ];

  await databaseTransaction(sql, args);

  await databaseTransaction('DELETE FROM order_item WHERE order_id = $1', [
    body.order_id,
  ]);

  for (let i = 0; i < body.itens.length; i++) {
    sql =
      'INSERT INTO order_item (order_id, order_item_order, product_id, quantity, observation, price) VALUES ($1, $2, $3, $4, $5, $6)';

    args = [
      body.order_id,
      body.itens[i].order_item_order,
      body.itens[i].product_id,
      body.itens[i].quantity,
      body.itens[i].observation,
      body.itens[i].price,
    ];

    await databaseTransaction(sql, args);
  }

  return body.order_id;
}

async function deleteOrder(id) {
  let sql = 'SELECT DISTINCT 1 FROM orders WHERE paid = true AND order_id= $1';

  const res = await databaseTransaction(sql, [id]);

  if (res[0]) {
    throw new Error('Pedido já está pago, não pode ser excluído.');
  }

  sql = 'DELETE FROM orders WHERE order_id = $1';

  await databaseTransaction(sql, [id]);

  sql = 'DELETE FROM order_item WHERE order_id = $1';

  await databaseTransaction(sql, [id]);

  return;
}

module.exports = {
  selectOrders,
  selectOrder,
  insertOrder,
  updateOrder,
  deleteOrder,
};
