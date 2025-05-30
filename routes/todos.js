const express = require("express");
const db = require("../models");
const authenticate = require("../middleware/auth");
const planLimiter = require("../middleware/planLimiter");
const { Op } = db.Sequelize;

const router = express.Router();

// Search by name
router.get("/todos/name", authenticate, planLimiter, async (req, res) => {
  const { search } = req.query;

  if (!search)
    return res.status(400).json({ message: "Search query is required" });

  try {
    const results = await db.Todo.findAll({
      where: {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      },
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Search by description
router.get(
  "/todos/description",
  authenticate,
  planLimiter,
  async (req, res) => {
    const { search } = req.query;

    if (!search)
      return res.status(400).json({ message: "Search query is required" });

    try {
      const results = await db.Todo.findAll({
        where: {
          description: {
            [Op.iLike]: `%${search}%`,
          },
        },
      });
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

module.exports = router;
