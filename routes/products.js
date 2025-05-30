const express = require("express");
const db = require("../models");
const authenticate = require("../middleware/auth");
const planLimiter = require("../middleware/planLimiter");
const { Op } = db.Sequelize;

const router = express.Router();

// Search by category
router.get(
  "/products/category",
  authenticate,
  planLimiter,
  async (req, res) => {
    const { search } = req.query;
    if (!search)
      return res.status(400).json({ message: "Search query is required" });

    try {
      const results = await db.Product.findAll({
        where: {
          category: {
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

// Search by name
router.get("/products/name", authenticate, planLimiter, async (req, res) => {
  const { search } = req.query;
  if (!search)
    return res.status(400).json({ message: "Search query is required" });

  try {
    const results = await db.Product.findAll({
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
  "/products/description",
  authenticate,
  planLimiter,
  async (req, res) => {
    const { search } = req.query;
    if (!search)
      return res.status(400).json({ message: "Search query is required" });

    try {
      const results = await db.Product.findAll({
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

// Search by price range
router.get(
  "/products/price-range",
  authenticate,
  planLimiter,
  async (req, res) => {
    const { min, max } = req.query;
    if (!min || !max)
      return res.status(400).json({ message: "Both min and max are required" });

    try {
      const results = await db.Product.findAll({
        where: {
          price: {
            [Op.between]: [parseFloat(min), parseFloat(max)],
          },
        },
      });
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

// Search by quantity range
router.get(
  "/products/quantity-range",
  authenticate,
  planLimiter,
  async (req, res) => {
    const { min, max } = req.query;
    if (!min || !max)
      return res.status(400).json({ message: "Both min and max are required" });

    try {
      const results = await db.Product.findAll({
        where: {
          quantity: {
            [Op.between]: [parseInt(min), parseInt(max)],
          },
        },
      });
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

// Low stock (< 20)
router.get(
  "/products/low-stock",
  authenticate,
  planLimiter,
  async (req, res) => {
    try {
      const results = await db.Product.findAll({
        where: {
          quantity: {
            [Op.lt]: 10,
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
