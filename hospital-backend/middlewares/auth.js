const userModel = require('../models/User');
const jwt = require("jsonwebtoken");
exports.isAuthenticatedUser = async (req, res, next) => {
  const token = req.header("Authorization");
  // const { token } = req.cookies;
  if (!token) {
    res.status(401).json({ message: "Please Login to access" });
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodedData.id);
  next();
};
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(401).json({ message: "Only admin can access this" });
    }
    next();
  };
};