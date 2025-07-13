
const jwt = require('jsonwebtoken');
const User = require('./models/user.js');
const JWT_SECRET = process.env.JWT_SECRET;

const isLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
//   console.log(authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(401).send({ msg: "Invalid or expired token" });
  }
};
module.exports = isLoggedIn ;
