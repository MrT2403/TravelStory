import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // No token, unauthorized
  if (!token)
    return res
      .status(401)
      .json({ error: true, message: "Access token required" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // Token invalid, forbidden
    if (err)
      return res.status(403).json({ error: true, message: "Invalid token" });
    req.user = user;
    next();
  });
};

export default authenticateToken;
