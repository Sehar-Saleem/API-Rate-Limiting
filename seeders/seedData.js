const db = require("../models");

async function seed() {
  await db.sequelize.sync({ force: true });

  const todos = [];
  const products = [];

  for (let i = 0; i < 1000; i++) {
    todos.push({
      name: `Todo ${i + 1}`,
      description: `Description for todo ${i + 1}`,
    });
    products.push({
      name: `Product ${i + 1}`,
      description: `Description for product ${i + 1}`,
      quantity: Math.floor(Math.random() * 100),
      price: parseFloat((Math.random() * 100).toFixed(2)),
      category: `Category ${i % 10}`,
    });
  }

  await db.Todo.bulkCreate(todos);
  await db.Product.bulkCreate(products);

  console.log("Seeded 1000 todos and 1000 products");
}

seed();
