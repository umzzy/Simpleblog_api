const isAdmin = (req, res, next) => {
  try {
    if (req.user && (req.user.role === 1 || req.user.role === 2)) {
      next();
    } else {
      res.code = 403;
      throw new Error("Access denied. Admins only.");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = isAdmin;
