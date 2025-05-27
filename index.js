const express = require("express");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const db = require("./models");
const authRoutes = require("./routes/auth");
const authenticate = require("./middleware/auth");
const planLimiter = require("./middleware/planLimiter");
// const todosRoutes = require("./routes/todos");
// const productsRoutes = require("./routes/products");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Global rate limit for unauthenticated routes: It helps prevent brute-force attacks
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Allows up to 30 requests per IP every 15 minutes
  max: 30,
});
app.use(generalLimiter);

// Public routes
app.use(authRoutes);

// Protected example route
app.get("/private", authenticate, planLimiter, (req, res) => {
  res.send(`Welcome ${req.user.username}, plan: ${req.user.plan}`);
});
// app.use(todosRoutes);
// app.use(productsRoutes);

// Sync DB
db.sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
