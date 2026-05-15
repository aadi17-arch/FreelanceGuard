import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No Token Provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch (error) {
    return res.status(401).json({ message: "Invalid Token Error" });
  }
};
export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'ADMIN') {
      next();
    }
    else {
      res.status(403).json({message:"Access denied. Admin privileges required"});
    }
  }
  catch (e) {
    return res.status(500).json({message:"Server error."})
  }
}
export default authMiddleware;
