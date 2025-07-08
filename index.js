require('dotenv').config();

const express = require('express');

const cors = require('cors');

const clientRoutes = require('./methods/client.js');

const ingredientRoutes = require('./methods/ingredient.js');

const recipeRoutes = require('./methods/recipe.js');

const productRoutes = require('./methods/product.js');

const orderRoutes = require('./methods/order.js');

const logRoutes = require('./methods/log.js');

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.get('/Connection', (_, res) => {
  res.json({
    message: 'Connected.',
  });
});

app.use('/Cliente', clientRoutes);

app.use('/Ingrediente', ingredientRoutes);

app.use('/Receita', recipeRoutes);

app.use('/Produto', productRoutes);

app.use('/Pedido', orderRoutes);

app.use('/Log', logRoutes);

app.listen(port);
