const rateLimit = require("express-rate-limit");

const freeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Free plan: Too many requests, try again later",
});

const paidLimiter = (req, res, next) => next(); // No limit for now

const planLimiter = (req, res, next) => {
  if (req.user.plan === "free") {
    return freeLimiter(req, res, next);
  } else {
    return paidLimiter(req, res, next);
  }
};

module.exports = planLimiter;
